from multiprocessing import Process, Manager
from socket import timeout
from deap import base, creator

from .MPCSmartML import *
from .optimizations import random_search, ea_custom
from .constants import metrics

import numpy as np
from .cvi import Validation

from sklearn.datasets import load_iris
import pickle

global PUB_INSTANCE

fitness_weights = (1,-1, 1,)
creator.create("FitnessMulti", base.Fitness, weights=fitness_weights)
creator.create("Individual", list, fitness=creator.FitnessMulti)

class PartitionWorker(Process):
    def __init__(self, args, partition, ds, publish) -> None:
        self.args = args
        self.partition = partition
        self.duration = args["ngen"]
        self.datastore = ds
        # self.pub_instance = publish
        # PUB_INSTANCE = publish
        
        self.__init_clustjob()
        super().__init__()
        
    
    def obj_summary(self):
        label = self.partition[0] if len(self.partition) == 1 else "__".join(self.partition)
        return {
            "name": label,
            "pid": self.pid,
            "val": self.partition,
        }
    
    # Todo: Condition task objective (moop, single cvi)
    def __init_clustjob(self):
        self.mpc = MPCSmartML(self.args, self.partition, True)
    
    def run(self):
        # Todo: Define pop, toolbox, updates, {shared res} ?
        nparts = len(self.partition)
        toolbox = self.mpc.toolbox
        pop = self.mpc.toolbox.population(n=10)
        print("Publish worker: ", type(self.pub_instance))
        if nparts == 1:
            random_search(self.pid, self.duration, 10, pop, toolbox, self.partition, self.datastore, PUB_INSTANCE)#self.pub_instance)
        elif nparts > 1:
            ea_custom(self.pid, self.duration, 10, pop, toolbox, self.partition, 0.7, 0.3, self.datastore, PUB_INSTANCE)#self.pub_instance)
    

class PartitionController:
    def __init__(self, clust_config, publish) -> None:
        self.args = clust_config
        self.publish = publish
        PUB_INSTANCE = publish

        # Pickle publisher ?
        # print("Entry point pub: ", self.publish)
        # print("Entry point pub (T): ", type(self.publish))
        # rel_path = "tmp/pub.pickle"
        # source = os.path.join(os.path.dirname(__file__), rel_path)
        # f = open(source)
        # pickle.dump(self.publish, f)

        
        # self.GDEAP_CREATOR = None
        data = load_iris()
        self.X, y = data.data, data.target
        
        self.__init_global_deap_creator()
        self.__init_partitions(clust_config)
        self.__init_shared_datastore()
        self.__init_workers()
    
    # Todo: [WIP] Extend to include main toolbox
    def __init_global_deap_creator(self):
        self.cvi = metrics.CVIS[self.args["metrics"]]
        # fitness_weights = (np.float(self.cvi[0][1]), np.float(self.cvi[1][1]), np.float(self.cvi[2][1]))
        # creator.create("FitnessMulti", base.Fitness, weights=fitness_weights)
        # creator.create("Individual", list, fitness=creator.FitnessMulti)
        
        # Initialize main toolbox
        self.main_toolbox = base.Toolbox()
        self.main_toolbox.register("evaluate", self.__controller_multi_fitness)
        self.main_toolbox.register("select", tools.selNSGA2)
        
    
    def __controller_multi_fitness(self, ind):
        try:
            cluster = ind[0].fit(self.X)
            labels = cluster.labels_
            validate = Validation(np.asmatrix(self.X).astype(np.float), np.asarray(self.X), labels)
            metric_values = validate.run_list([self.cvi[0][0], self.cvi[1][0], self.cvi[2][0]])
            return metric_values[self.cvi[0][0]], metric_values[self.cvi[1][0]], metric_values[self.cvi[2][0]]
        except Exception as e:
            return 0, 0, 0
        
        
    def count_workers(self):
        print(len(self.__workers))
    
    def __init_partitions(self, config):
        hparams = config["partitions"]["hparams"]
        hparts = config["partitions"]["hparts"]
        partition_list = list()
        
        for hpm in hparams:
            partition_list.append(hpm["val"])
        
        for hpt in hparts:
            partition_list.append(hpt["val"])
        
        self.partitions = partition_list 
        print("Selected partitions = ", self.partitions)
        
    def __init_workers(self):
        self.__workers = list()
        for hparts in self.partitions:
            self.__workers.append(PartitionWorker(self.args, hparts, self.darwin, self.publish))
        print("# of workers = ", len(self.__workers))
        
        
        # Todo: Update partition data on frontend - share PIDs
        new_partitions = [w.obj_summary() for w in self.__workers]
        print("New partitions = ", new_partitions)
        if self.publish is not None:
            self.publish({
                "label": "Worker process(es) created",
                "workers": new_partitions
            }, "message")
        
    def __init_shared_datastore(self):
        manager = Manager()
        self.darwin = manager.list()
        
    # Todo: Poison Pill
    def __stop_workers(self, pids):
        pass
    
    # Todo: Move to Cluster class ?
    def get_n_clusters(self, config):
        labels = config.fit(self.X).labels_
        return len(set(labels))
    
    # Helper functino
    def get_partition(self, ind):
        top_partitions = list()
        ind_str = str(ind)
        ind_str = ind_str.split("(")[1]
        ind_str = ind_str.split(")")[0]
        
        qparams = [q for i, q in enumerate(ind_str.split("=")) if i % 2 == 0 and q.isalpha()]
        if len(qparams) == 1:
            return qparams[0]
        else:
            return "__".join(qparams)
                
            
        
    
    # Merg results, select top N
    def merge_results(self, darwin, N=10):
        hof = list()
        for pid, pop in darwin:
            for p in pop:
                hof.append(p)
        
        topN = self.main_toolbox.select(hof, N)
        
        summary = list()
        
        fitnesses = self.main_toolbox.map(self.main_toolbox.evaluate, topN)
        rank_id = 0
        
        for ind, fit in zip(topN, fitnesses):
            ind.fitness.values = fit
            fitness_scores = (round(fit[0], 2),  round(fit[1], 2), round(fit[2], 2))
            summary.append({
                "algorithm": self.args["algorithm"],
                "n_clusters": self.get_n_clusters(ind[0]),
                "partition": self.get_partition(ind[0]),
                "fitness": str(fitness_scores),
                "config": ind[0],
                "id": rank_id + 1
            })
            rank_id += 1
        
        return summary
        
    def process_search(self):
        for worker in self.__workers:
            worker.start()
            if self.publish is not None:
                self.publish({
                    "label": "Worker process(es) created",
                    "psinfo": worker.obj_summary()
                }, "message")
        for worker in self.__workers:
            worker.join()
            
        return self.darwin
    
    def run_workers(self):
        results = self.process_search()
        # for worker in self.__workers:
        #     worker.start()
            # self.publish({
            #     "label": "Worker process(es) created",
            #     "psinfo": worker.obj_summary()
            # }, "message")
        
        # for worker in self.__workers:
        #     worker.join()
        
        # print("# Workers = ", c)
        # print("HOF = ", self.darwin)
        topN = self.merge_results(results)
        # Final results
        return topN
            
    

# Todo: Update example
# if __name__ == "__main__":
#     from sklearn.datasets import load_iris
    
#     data = load_iris()
#     X, y = data.data, data.target
    
    
#     dargs = {
#         "dataset": X,
#         "algorithm": "kmeans",
#         "metrics": "cvi-102",
#         "ngen": 2,
#     }
    
#     hparts = [['n_clusters']]
#     # hparts = [['n_clusters'],['n_clusters', 'n_init'], ['n_clusters', 'max_iter']]
    
#     pcpc = PartitionController(hparts, dargs)
#     pcpc.run_workers()
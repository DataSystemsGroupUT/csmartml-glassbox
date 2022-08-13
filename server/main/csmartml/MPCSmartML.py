import pandas as pd
import numpy as np
import time
import sys
import multiprocessing

from csmartml.MetaCVI import MetaCVI
from csmartml.MetaAlgorithm import Algorithm
from csmartml.cvi import Validation
from multiprocessing import Process

from sklearn import metrics
from deap import base, creator, tools, algorithms

from csmartml.constants import metrics

from csmartml.HyperPartitions import *
from csmartml.GeneticMethods import *

import random
from sklearn.datasets import load_iris
    
    
class MPCSmartML:
    def __init__(self, args, partition, multi=True) -> None:
        # Todo: resolve metric initialization with Objective
        data = load_iris()
        X, y = data.data, data.target
        
        self.dataset = X # args["dataset"]
        self.algorithm = args["algorithm"]
        self.cvi = metrics.CVIS[args["metrics"]]
        self.partition = partition
        
        if multi:
            self.init__multi_obj_task()
        else:
            # Todo: Resolve later
            self.init__single_obj_task()
    
    
    def multi_fitness_function(self, individual):
        try:
            clustering = individual[0].fit(self.dataset)
            labels = clustering.labels_
            validate = Validation(np.asmatrix(self.dataset).astype(np.float), np.asarray(self.dataset), labels)
            metric_values = validate.run_list([self.cvi[0][0], self.cvi[1][0], self.cvi[2][0]])
            return metric_values[self.cvi[0][0]], metric_values[self.cvi[1][0]], metric_values[self.cvi[2][0]]
        except Exception as e:
            print(e)
            return 0, 0, 0

    def init__multi_obj_task(self):
        # fitness_weights = (np.float(self.cvi[0][1]), np.float(self.cvi[1][1]), np.float(self.cvi[2][1]))
        # opts = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]
        # cr_id = random.choice(opts)
        # fit = f"FitnessMulti{cr_id}"
        # indy = f"Individual{cr_id}"
        
        # creator.create(fit, base.Fitness, weights=fitness_weights)
        # creator.create(indy, list, fitness=eval(f"creator.{fit}"))
        
        # creator.create("FitnessMulti", base.Fitness, weights=fitness_weights)
        # creator.create("Individual", list, fitness=creator.FitnessMulti)
        # eval(f"creator.{indy}")
        mx = self.Mode(self.partition, self.dataset, self.algorithm)
        self.toolbox = base.Toolbox()
        self.toolbox.register("individual", tools.initRepeat, creator.Individual , mx.gen_population, n=1)
        self.toolbox.register("population", tools.initRepeat, list, self.toolbox.individual)
        self.toolbox.register("evaluate", self.multi_fitness_function)
        self.toolbox.register("select", tools.selNSGA2)
        if len(self.partition) > 1:
            self.toolbox.register("mate", mx.crossover)
            self.toolbox.register("mutate", mx.mutate)

    
    # Todo: complete initialiation
    def init__single_obj_task(self):
        fitness_weights = (np.float(self.cvi[0][1]),)
        
    
    class Mode:
        """ Inner Class for genetic methods of inidividual hyper-partitions"""
        def __init__(self, partition, data, algorithm):
            self.model = GeneticMethods(partition, data, algorithm)

        def gen_population(self):
            return self.model.generate_pop()

        def crossover(self, ind1, ind2):
            return self.model.crossover(ind1, ind2)

        def mutate(self, individual):
            return self.model.mutate(individual)
    
    
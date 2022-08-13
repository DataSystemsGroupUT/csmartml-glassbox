from csmartml.worker import PartitionController
from sklearn.datasets import load_iris


# Todo: Create example
if __name__ == "__main__":
    
    data = load_iris()
    X, y = data.data, data.target
    
    hparts = [['n_clusters']]
    
    dargs = {
        "dataset": X,
        "algorithm": "kmeans",
        "metrics": "cvi-102",
        "ngen": 2,
        "partitions":{
            "hparams": hparts,
            "hparts": [],
        }
    }

    dargs = {
        'dataset': [], 
        'algorithm': 'birch', 
        'metrics': 'cvi-102', 
        'partitions': {
            'hparams': [
                {
                    'active': True, 
                    'name': 'threshold', 
                    'pid': None, 
                    'running': True, 
                    'val': ['threshold']
                }, 
                {
                    'active': False, 
                    'name': 'branching_factor', 
                    'pid': None, 
                    'running': True, 
                    'val': ['branching_factor']
                }
            ], 
            'hparts': [
                {
                    'active': False, 
                    'name': 'threshold__n_clusters', 
                    'pid': None, 
                    'running': True, 
                    'val': ['threshold', 'n_clusters']
                }, 
                {
                    'active': False, 
                    'name': 'branching_factor__n_clusters', 
                    'pid': None, 
                    'running': True, 
                    'val': ['branching_factor', 'n_clusters']
                }
            ]
        }, 
        'ngen': 10
    }
    
    # hparts = [['n_clusters'],['n_clusters', 'n_init'], ['n_clusters', 'max_iter']]
    
    # dargs["partitions"]["hparams"] = hparts

    pcpc = PartitionController(dargs, None)
    pcpc.run_workers()
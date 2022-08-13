from csmartml.worker import PartitionController


if __name__ == "__main__":
    dargs = {
        "dataset": [],
        "algorithm": "birch",
        "metrics": "cvi-102",
        "partitions": {
            "hparts": [
                {
                    "name": "threshold & n_clusters",
                    "val": ['threshold', 'n_clusters'],
                    "pid": None,
                    "active": False,  
                },
            ],
            "hparams": [
                {
                    "name": "branching_factor",
                    "val": ['branching_factor'],
                    "pid": None,
                    "active": False,                
                },
                {
                    "name": "threshold",
                    "val": ['threshold'],
                    "pid": None,
                    "active": False,                
                }
            ],
        },
        "ngen": 3,
    }
    
    hparts = [['branching_factor'], ['threshold']]
    # hparts = [['n_clusters'],['n_clusters', 'n_init'], ['n_clusters', 'max_iter']]

    pcpc = PartitionController(dargs, None)
    A = pcpc.run_workers()
    print(A)
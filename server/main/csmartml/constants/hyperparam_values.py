from abc import abstractmethod
import random
import numpy as np
from dataclasses import dataclass


@dataclass
class Parameter:
    name: str
    range: tuple
    dtype: str

@dataclass
class SearchSpace:
    algorithm: str
    parameter: Parameter


class ClustConfig:
    def __init__(self, data_len) -> None:
        self.data_len = data_len
        self.__init_ranges()
    
    def __init_ranges(self):
        self.config_ranges = {
            "birch": { # wrapped ints because int64 not json serializable
                'threshold': [(0.01, 0.5, 0.001), 'float'],
                'branching_factor': [(2, int(self.data_len / 5)), 'int'],
                'n_clusters': [(2, int(self.data_len / 5)), 'int'],
            },
            "db": { # wrapped ints because int64 not json serializable
                'eps': [(0.1,2.0), 'float'],
                'min_samples': [(5, 20), 'int'],
            },
        }
    
    @abstractmethod
    def __init_mod_ranges(self):
        pass
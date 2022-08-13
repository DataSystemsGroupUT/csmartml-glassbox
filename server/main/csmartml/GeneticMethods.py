import os
import copy
import random
import json

# from Algorithms import *
from .Algorithms import *
from .constants.hyperparam_values import ClustConfig
from .constants import temp


class GeneticMethods:

	def __init__(self, parameters, data, algorithm):
		# Differentiate mutable params from immutable
		self.params = parameters
		self.param_size = len(parameters)
		self.data = data
		self.algorithm = algorithm
		# return

	def generate_pop(self):
		pop = self.custom_algorithm_config(self.params)
		return pop

	def mutate(self, pop):
		p = self.generate_pop()
		tpop = copy.deepcopy(pop)

		for i in range(self.param_size):
			pos = random.choice(list(range(0, self.param_size)))
			setattr(tpop[0], self.params[pos], getattr(p, self.params[pos]))

		return tpop,

	def crossover(self, pop, pop2):
		tpop, tpop2 = copy.deepcopy(pop), copy.deepcopy(pop2)

		for i in range(self.param_size):
			pos = random.choice(list(range(0, self.param_size)))
			setattr(tpop[0], self.params[pos], getattr(tpop2[0], self.params[pos]))
			setattr(tpop2[0], self.params[pos], getattr(tpop[0], self.params[pos]))

		return tpop, tpop2

	# Feeds into population initialization
	def custom_algorithm_config(self):
     
		config = GeneticMethods.create_temporary_config(
			self.algorithm,
			len(self.data)
		)

		algorithms = {
			# 'kmeans': KMEANS(params, self.data),
			# 'meanshift': MEANSHIFT(params, self.data),
			'db': DB(self.params, config),
			# 'ap': AP(params, self.data),
			# 'spectral': Spectral(params, self.data),
			# 'ag': AG(params, self.data),
			# 'optics': OP(params, self.data),
			'birch': BIRCH(self.params, config)
		}

		return algorithms[self.algorithm].config()

	# Create temporary config for algorithm
	@staticmethod
	def create_temporary_config(algorithm, data_len):
		all_configs = ClustConfig(data_len)
		search_space = all_configs.config_ranges[algorithm]

		filepath = f"tmp/{temp.TEMP_CONFIG_FILE_PREFIX}_{algorithm}.json"
		if not os.path.exists(filepath):
			source = os.path.join(os.path.dirname(__file__), filepath)
			with open(source, "w") as f:
				json.dump(search_space, f, indent=4)
		else:
			f = open(filepath)
			dd = json.load(f)
			print("Current file: ", dd)
    
		return search_space
  
	


# import pandas as pd
# from sklearn.cluster import Birch
# from sklearn.datasets import load_iris

# if __name__ == "__main__":
# 	file = "./Datasets/processed/{}.csv".format("iris")
# 	data, target = load_iris().data, load_iris().target
# 	gm = GeneticMethods(["n_clusters", "threshold"], data, "birch")
# 	gm.custom_algorithm_config()
# 	# pop = KMeans(n_clusters=20, init="random")
# 	# gm.mutate(pop)
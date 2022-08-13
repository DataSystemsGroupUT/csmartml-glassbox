import time
from sklearn.cluster import KMeans, MeanShift, DBSCAN, \
	AffinityPropagation, SpectralClustering, AgglomerativeClustering, \
	OPTICS, Birch
from deap import base, creator, tools, algorithms


# Random search for single hyper-parameter tuning
def random_search(pid, t, s, population, toolbox, hparam, res, pub_instance):

    hparam_label = hparam[0]

    # Evaluate the individuals with an invalid fitness
    invalid_ind = [ind for ind in population if not ind.fitness.valid]
    fitnesses = toolbox.map(toolbox.evaluate, invalid_ind)
    for ind, fit in zip(invalid_ind, fitnesses):
        ind.fitness.values = fit

    ngen = 0
    
    # Trial log: Stores hparam val: metric scores: ngen/trial for each model
    model_summary = list()
    hparam_value = lambda individual: eval(str(individual[0]) + "." + hparam_label)
    
    while ngen < t:
        # if ngen > 0:
        # 	# publish({"label": "Random Search [Process-{}]: NGEN ({})".format(pid, ngen)}, "message")
        # 	print("RANDOM: [NGEN - {}]".format(ngen))
        # print("{} :: {}".format(pid, ngen))

        offspring = toolbox.select(population, len(population))

        # Generate random new individuals
        offspring = toolbox.population(n=s) + offspring

        # Evaluate the individuals with an invalid fitness
        invalid_ind = [ind for ind in offspring if not ind.fitness.valid]
        fitnesses = toolbox.map(toolbox.evaluate, invalid_ind)

        model_summary = list()
        for ind, fit in zip(invalid_ind, fitnesses):
            ind.fitness.values = fit
            pval = hparam_value(ind)

            if fit != (0, 0, 0): # Todo: remove individuals with invalid fitness
                model_summary.append([pval, fit[0], fit[1], fit[2], ngen+1])
        
        print("RS Model Summary: ", len(model_summary))
        # print(model_summary)
        
        # pub_instance({
        #     "label": "New trail done",
        #     "rsdata": model_summary,
        #     "rslabel": hparam_label,
        # }, "message")
        
        # Replace the current population by the offspring
        population[:] = offspring

        ngen += 1
    
    res.append([pid, population])


def hparam_vals(hplist, ind):
    hpval = list()
    for hp in hplist:
        hpval.append(eval(str(ind[0]) + "." + hp))
    return hpval


# Custom Evolutionary Algorithm: With Time Budget
def ea_custom(pid, t, s, population, toolbox, hparts, cxpb, mutpb, res, publish):

    # Evaluate the individuals with an invalid fitness
    invalid_ind = [ind for ind in population if not ind.fitness.valid]
    fitnesses = toolbox.map(toolbox.evaluate, invalid_ind)
    for ind, fit in zip(invalid_ind, fitnesses):
        ind.fitness.values = fit

    # Begin the [TIMED] generational process
    ngen = 0
    
    hparts_label = "__".join(hparts)

    # Trial log: Stores hparam val: metric scores: ngen/trial for each model
    model_summary = list()

    # Select the next generation individuals
    while ngen <= t:
        # if ngen > 0:
        #     publish({
        #         "label": "Evolutionary Algorithm [Process-{}]: NGEN ({})".format(pid, ngen)
        #         }, "message")
        # offspring = toolbox.select(population, len(population))
        ngen += 1
        # print("{} :: {}".format(pid, ngen))

        # Vary the pool of individuals
        offspring = algorithms.varOr(population, toolbox, s, cxpb, mutpb)  # 20 for mu or lambda
        # offspring = algorithms.varAnd(offspring, toolbox, cxpb, mutpb)

        select_from = offspring + population
        # Evaluate the individuals with an invalid fitness
        invalid_ind = [ind for ind in select_from if not ind.fitness.valid]
        fitnesses = toolbox.map(toolbox.evaluate, invalid_ind)

        # Temp variables to update Frontend

        for ind, fit in zip(invalid_ind, fitnesses):
            ind.fitness.values = fit

            # Tuned parameter value, fitness value, current generation
            # print(eval(str(ind[0]) + "." + label))
            if fit != (0, 0, 0):
                thpvals = hparam_vals(hparts, ind)
                drow = thpvals + [i for i in fit] + [ngen+1]
                print("DROW: ", drow)
                model_summary.append(drow)
                # trial_log.append([0, fit, ngen])

        print("GA Model Summary")
        # print(model_summary)
        
        # publish({
        #     "label": "New trail done",
        #     "gadata": model_summary,
        #     "galabel": hparts_label,
        # }, "message")

        # Replace the current population by the offspring
        # population[:] = offspring
        population[:] = toolbox.select(select_from, s)  # Mu plus lambda : ea

    res.append([pid, population])
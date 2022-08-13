import os
import json
from csmartml.GeneticMethods import GeneticMethods
from csmartml.constants import temp

fparams = lambda p: {"name": p[0], "val": p, "pid": None, "active": False, "running": False}
fparts = lambda p: {"name": str("__".join(p)), "val": p, "pid": None, "active": False, "running": False}

def init_hpartitions(hp_set):
    
    ap = None
    
    hparams = [p for p in hp_set if len(p) == 1]
    hparams_formatted = list()
    for i, hp in enumerate(hparams):
        temp = fparams(hp)
        if i == 0:
            temp["active"] = True
            ap = hp[0]
        hparams_formatted.append(temp)
   
    hparts = [p for p in hp_set if len(p) > 1]
    hparts_formatted = list()
    for i, hp in enumerate(hparts):
        temp = fparts(hp)
        hparts_formatted.append(temp)
    
    return (hparams_formatted, hparts_formatted, ap)

def get_default_searchspace(algorithm, data_len):
    search_space = GeneticMethods.create_temporary_config(algorithm, data_len)
    return search_space

def set_searchspace(algorithm, parameter, val_ranges):
    # Get current searchspace if exists
    filepath = f"tmp/{temp.TEMP_CONFIG_FILE_PREFIX}_{algorithm}.json"
    
    if os.path.exists(filepath):
        config = json.load(open(filepath))
        curr_ss = config[parameter][0]
        # Set new config
        config[parameter][0] = val_ranges
        # Update config file
        with open(filepath, "w") as f:
            json.dump(config, f, indent=4)
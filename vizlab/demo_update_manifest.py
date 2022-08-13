import os
import numpy as np
import pandas as pd
from geotiff import GeoTiff


def get_tile_key(filename):
    tile = filename[:-4]
    seg = tile.split("_")
    return "{}_{}".format(seg[-2], seg[-1])


def get_parcel_ids(imgpath):
    img = np.array(GeoTiff(imgpath).read())
    pids = [p for p in np.unique(img) if p == abs(p)]
    return pids


if __name__ == "__main__":
    
    dd = "/Users/ava/Documents/Work/kz/notebooks/Transit/ARD-EE-RR/Rasters/EE_ARD_MARCH_MAY/investigate/EST_6DCOH_DATA/"
    dd_geom = os.path.join(dd, "geom_train_MASTER")
    
    manifest_loc = os.path.join(dd, "manifest_train_MASTER.csv")
    mod_manifest_loc = os.path.join(dd, "manifest_train_MASTER_II.csv")
    manifest = pd.read_csv(manifest_loc)
    
    stats = list()
    
    for ix, row in manifest.iterrows():
        pred_ = row["predict"]
        ref_ = row["reference"]
        
        k = get_tile_key(pred_)
        ref_geom = f"{k}.tif"
        ref_geom_file = os.path.join(dd_geom, ref_geom)
        parcels = []
        if os.path.exists(ref_geom_file):
            parcels = get_parcel_ids(os.path.join(dd_geom, ref_geom))
        
        stats.append([pred_, ref_, ref_geom, parcels])
    
    df = pd.DataFrame(stats, columns=["predict", "reference", "parcel_geom", "parcels"])
    df.to_csv(mod_manifest_loc, index=False)
        
        
    
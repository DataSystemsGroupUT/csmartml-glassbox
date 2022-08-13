import os
import datetime
import numpy as np
import pandas as pd
import tensorflow as tf
from geotiff import GeoTiff


# 1_087_20220420T154857_20220502T154858_T35VMF_20220504T094029_10725_0.tif
def get_s1_s2_lag(filename):
    seg = filename.split("_")
    s1_doy = parse_doy(seg[3], time_index=-1)
    s2_doy = parse_doy(seg[-3], time_index=-1)
    return s1_doy - s2_doy

def get_ron_area(filename):
    seg = filename.split("_")
    return int(seg[1]), seg[4]

def get_aoi_id(filename):
    f = filename[:-4] # ext 
    chunks = f.split("_")
    if len(chunks) == 8:
        return "{}_{}_{}".format(chunks[-4], chunks[-2], chunks[-1])
    elif len(chunks) == 7:
        return "{}_{}_{}".format(chunks[-3], chunks[-2], chunks[-1])

def parse_month(filename, time_index=3):
    if filename is None:
        return filename
    else:
        filename = filename.split("_")
        dateinfo = filename[time_index].split("T")[0]
        dateobj = datetime.datetime.strptime(dateinfo, "%Y%m%d")

        return dateobj.timetuple().tm_mon

def parse_doy(filename, time_index=3):
    filename = filename.split("_")
    if time_index == -1 :
        dateinfo = filename[0].split("T")[0]
        dateobj = datetime.datetime.strptime(dateinfo, "%Y%m%d")
    else:
        dateinfo = filename[time_index].split("T")[0]
        dateobj = datetime.datetime.strptime(dateinfo, "%Y%m%d")

    return dateobj.timetuple().tm_yday

def get_parcel_ids(img: np.ndarray):
    return np.unique(img)

# Compare ndvi-sndvi MAE
def polygon_mae(source_ndvi, source_sndvi, source_parcel, pid):
    parcel = np.where(source_parcel == pid, 1, 0)
    ndvi = np.where((parcel != 0), source_ndvi, 1)
    sndvi = np.where((parcel != 0), source_sndvi, 1)
    return tf.reduce_mean(tf.abs(ndvi-sndvi)).numpy()
    

def get_nonempty_ptiles(source_dir):
    
    nempty = list()
    for tile in os.listdir(source_dir):
        if tile.endswith("tif"):
            t_arr = np.array(GeoTiff(os.path.join(source_dir, tile)).read())
            if not np.all(t_arr == -32768):
                nempty.append(tile[:-4])
    
    return nempty
                
def get_tile_key(filename):
    tile = filename[:-4]
    seg = tile.split("_")
    return "{}_{}".format(seg[-2], seg[-1])


def read_img(impath):
    image = tf.io.read_file(impath)
    image = tf.image.decode_png(image)

    img_partitions = [img for img in tf.split(image, num_or_size_splits=3, axis=1)]
    img_partitions = [tf.cast(img, tf.float32) for img in img_partitions]

    tar = img_partitions[2]/255.0
    prediction = img_partitions[1]/255.0
    
    return prediction, tar


def get_metafeatures(filename, manifest):
    ref_file = manifest[manifest.predict == filename.replace("png", "tif")]["reference"].values[0]
    lag = abs(parse_doy(filename) - parse_doy(ref_file))
    s1s2_lag = get_s1_s2_lag(filename)
    # pred_ron, pred_area = get_ron_area(filename)
    # ref_ron, ref_area = get_ron_area(ref_file)
    doy, mon = parse_month(filename), parse_doy(filename)
    
    return [lag, s1s2_lag, doy, mon]


if __name__ == "__main__":
    # Get tiles with parcels to validate
    tile_geom_dir = None

    nempty_tiles = get_nonempty_ptiles(tile_geom_dir)

    # Load Evaluated file
    datadir = "../Transit/ARD_DE_2021_12DCOH/"
    parceldir = os.path.join(datadir, "geom_test_MASTER")
    outdir = os.path.join(datadir, "OUT__ARD_DE_2021_12DCOH__M6D")
    baseline_files = [f for f in os.listdir(outdir) if f in os.listdir(outdir) if f.endswith("png")]
    manifest = pd.read_csv(os.path.join(datadir, "manifest_test_MASTER.csv"))
    
    
    # Get filtered fils from baseline
    filtered = [f for f in baseline_files if get_tile_key(f) in nempty_tiles]
    
    # Evaluate
    stats = list()
    for file in filtered:
        key = get_tile_key(file)
        image_path = os.path.join(outdir, file)
        pred, tar = read_img(image_path)
        
        parcel = np.array(GeoTiff(os.path.join(parceldir, f"{key}.tif")).read())
        parcel_ids = get_parcel_ids(parcel)
        
        for pid in parcel_ids:
            pmae = polygon_mae(tar, pred, parcel, pid)
            mfeat = get_metafeatures(file, manifest)
            row = [file, pid] + mfeat + [pmae]
            stats.append()

   
    # Evaluate dataframe
    df = pd.DataFrame(stats, columns=["filename", "parcel_id", "lag", "s1s2_lag", "doy", "month", "mae"]) 
    df.to_csv("IQA__parcel_level.csv")
            
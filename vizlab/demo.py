# Get parcels from tile
import os
import time
import shutil
import numpy as np
from osgeo import gdal, gdalconst


def create_constant_raster(r_in, r_out):
    # print(r_out)
    reference = gdal.Open(r_in, gdalconst.GA_ReadOnly)
    referenceProj = reference.GetProjection()
    referenceTrans = reference.GetGeoTransform()
    x = reference.RasterXSize
    y = reference.RasterYSize

    band = reference.GetRasterBand(1)
    arr = band.ReadAsArray()
    zarr = np.full_like(arr, -32678)

    driver = gdal.GetDriverByName('GTiff')
    output = driver.Create(r_out, x, y, 1, gdal.GDT_Int16)
    output.SetGeoTransform(referenceTrans)
    output.SetProjection(referenceProj)
    output.GetRasterBand(1).WriteArray(zarr)
    del output

def get_unique_parcel_tiles(source_dir: str) -> dict:
    tile_parcels = dict()
    for tile in os.listdir(source_dir):
        k = get_tile_key(tile)
        tile_parcels[k] = tile_parcels.get(k, []) + [tile]
    return tile_parcels

def get_tile_key(filename):
    tile = filename[:-4]
    seg = tile.split("_")
    return "{}_{}".format(seg[-2], seg[-1])


    
if __name__ == "__main__":
    
    # KEYS: PARCEL_ID, PARCEL_FOR, KZ_id, FIELD_ID 
    mask_parcels = lambda key, geom, r_out: "gdal_rasterize -a {} {} {}".format(key, geom, r_out)
    constant_raster = lambda r_in, r_out: "gdal_create -if {} {}".format(r_in, r_out)

    dd = "/Users/ava/Documents/Work/kz/notebooks/Transit/ARD-EE-RR/Rasters/EE_ARD_MARCH_MAY/investigate/EST_6DCOH_DATA/"

    tile_source_dir = os.path.join(dd, "train_MASTER")
    tile_target_dir = os.path.join(dd, "geom_train_MASTER")

    parcel_shp = os.path.join(dd, "parcels/EE32635.shp")
    pid_idxr = "PARCEL_ID"
    
    if os.path.exists(tile_target_dir):
        shutil.rmtree(tile_target_dir)
    os.mkdir(tile_target_dir)
    
    PT = get_unique_parcel_tiles(tile_source_dir)
    
    for key, tiles in PT.items():
        parcel = f"{key}.tif"
        tilepath = os.path.join(tile_source_dir, tiles[0])
        r_out = os.path.join(tile_target_dir, parcel)
        create_constant_raster(tilepath, r_out)
        os.system(mask_parcels(pid_idxr, parcel_shp, r_out))
        
    # st = time.time()

    # for tile in os.listdir(tile_source_dir):
    #     if tile.endswith("tif"):
    #         tilepath = os.path.join(tile_source_dir, tile)
    #         r_out = os.path.join(tile_target_dir, tile)
    #         create_constant_raster(tilepath, r_out)
    #         os.system(mask_parcels(parcel_shp, r_out))
        
    # en = time.time()

    # print("Time elapsed: {}s".format(round(en-st, 2)))
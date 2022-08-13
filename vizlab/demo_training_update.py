import os
import numpy as np
import tensorflow as tf


def polygon_mae(source_ndvi, source_sndvi, source_parcel, pid):

    source_ndvi = tf.squeeze(source_ndvi, axis=-1).numpy()
    source_sndvi = tf.squeeze(source_sndvi, axis=-1).numpy()
    source_parcel = source_parcel.numpy()

    parcel = np.where(source_parcel == pid, 1, 0)
    ndvi = np.where((parcel != 0), source_ndvi, 0)
    sndvi = np.where((parcel != 0), source_sndvi, 0)

    N = np.count_nonzero(parcel)
   
    
    avg_ndvi = np.sum(ndvi)/N
    avg_sndvi = np.sum(sndvi)/N
    diff = abs(avg_ndvi - avg_sndvi)
    diff_scaled = abs(scale_ndvi(avg_ndvi) - scale_ndvi(avg_sndvi))


def generator_loss(disc_generated_output, gen_output, target):
    gan_loss = loss_object(tf.ones_like(disc_generated_output), disc_generated_output)

    # mean absolute error
    l1_loss = tf.reduce_mean(tf.abs(target - gen_output))
    # ssim_loss = tf.reduce_mean(tf.image.ssim(target, gen_output, 2.0))

    total_gen_loss = gan_loss +  (100 * l1_loss) #(100 * -ssim_loss) 

    return total_gen_loss, gan_loss, l1_loss


if __name__ ==  "__main__":
    pass
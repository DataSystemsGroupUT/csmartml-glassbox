import * as React from 'react';

export function update_rs_partition(json_data: any, scatterdata: any){
    const data = json_data["rsdata"]
    const partition = json_data["rslabel"]

    scatterdata[partition] = data
    return scatterdata
}
import * as React from 'react';

export function updatePartition(
        partitions: {[key: string]: [{}]},
        key: string,
        val: boolean){

    const pcopy = Object.assign({}, partitions)
    const ptype = key.includes("__") ? "hparts" : "hparams"
    const subpart = pcopy[ptype]

    subpart.forEach((v: {}, i: number) => {
        //@ts-ignore
        if (v.name === key){
            //@ts-ignore
            subpart[i]["active"] = val
        }
    })

    pcopy[ptype] = subpart
    return pcopy
}
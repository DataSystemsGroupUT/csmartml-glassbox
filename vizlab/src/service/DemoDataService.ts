import axios from 'axios';

export interface DemoDataStruct {
    name: string;
    n_features: number;
    n_instances: number;
    n_classes: number
}

export function getDemoCSV (dataset: string){
    const src = `/datasets/${dataset}.csv`;
    return fetch(src).then(response => {
        //@ts-ignore
        let reader = response.body.getReader();
        let decoder = new TextDecoder('utf-8');

        return reader.read().then(function (result) {
            console.log(result)
            return decoder.decode(result.value);
        });
    });
}
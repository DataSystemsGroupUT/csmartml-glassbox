import axios from "axios";


// Flask Server Configuration
const axiosInstance = axios.create({
    baseURL: `http://0.0.0.0:5555/`,
    // timeout: 1000,
    headers: {
        'Access-Control-Allow-Origin': '*'
    }
});


// DD: demo daAtasets
export async function getModelPartitions(dataset: string, algorithm: string){
    const url = "partitions";
    const headers = {'Content-Type': 'application/json'};
    const res = await axiosInstance.post(url, 
        { "dataset" : dataset, "algorithm" : algorithm}, {headers});
    console.log("RES = ", res)
    if (res.status === 200) {
        return res;
    }
    throw res;
}

export async function toggleWorker(pid: number){
    const url = "processmgr";
    const headers = {'Content-Type': 'application/json'};
    const res = await axiosInstance.post(url, 
        { "pid" : pid}, {headers});
    console.log("RES = ", res)
    if (res.status === 200) {
        return res;
    }
    throw res;
}

export async function getAlMetrics__DD(dataset: string){
    const url = `/almetry`;
    const headers = {'Content-Type': 'application/json'};
    const res = await axiosInstance.post(url, 
        { "dataset" : dataset}, {headers});
    if (res.status === 200) {
        return res;
    }
    throw res;
}



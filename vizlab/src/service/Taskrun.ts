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
export async function demoTaskRun(config: {}){
    const url = "testrun";
    const headers = {'Content-Type': 'application/json'};
    const res = await axiosInstance.post(url, 
        config, {headers});
    console.log("RES = ", res)
    if (res.status === 200) {
        return res;
    }
    throw res;
}
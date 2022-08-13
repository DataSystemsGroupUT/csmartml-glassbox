import * as React from 'react';
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid";

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { LoadingButton } from '@mui/lab';


import Paper from '@mui/material/Paper';
import CAppBar from '../components/CAppBar';

import { purple, pink, deepPurple } from '@mui/material/colors';

import  TaskConfiguration  from "../panels/TaskConfig";
import  EDA  from "../panels/EDA";
import Clusters from '../panels/Clusters';
import ModelSummary from "../panels/ModelSummary";
import Analytics from "../panels/Analytics";

import { getModelPartitions, toggleWorker } from '../service/InitParams';
import { demoTaskRun } from '../service/Taskrun';
import { update_rs_partition } from '../service/EventStream';
import { updatePartition } from '../service/utils';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : pink[100],
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: '#fff',
}));


export interface HomeState{
    toyDataset: string
    algorithm: string
    activepartition: string
    metrics: string
    partitions: any
    scatterdata: {}
    searchspace: {}
    pcadata: []
    topNClusters: {}
    activeCluster: [] 
    topN: []
    run: boolean
    ngen: number
}


export default class HomeBasicLight extends React.Component<{}, HomeState> {

    // Todo: Review architecture => STREAMING
    private eventSource = new EventSource("http://0.0.0.0:5555/stream");

    constructor(props: {}){
        super(props);
        this.state = {
            toyDataset: "iris",
            algorithm: "auto",
            metrics: "auto",
            activepartition: "",
            partitions: {},
            scatterdata: {},
            searchspace: {},
            topNClusters: {},
            activeCluster: [],
            pcadata: [],
            topN: [],
            run: false,
            ngen: 10
        };
    }

    componentDidMount = () => {
        this.eventSource = new EventSource(`http://0.0.0.0:5555/stream`);
        this.eventSource.addEventListener('message', (data) => {
            this.sentinel(data);
        });
    }

  

    componentDidUpdate(prevProps: {}, prevState: HomeState){
        if((prevState.toyDataset !== this.state.toyDataset)){
            // Todo: Render new EDA view
        }

        if((prevState.algorithm !== this.state.algorithm)){
            // Todo: Get hyper-parameters and hyper-partitions
            const { algorithm, toyDataset } = this.state
            getModelPartitions(toyDataset, algorithm).then((result: any) => {
                this.setState({
                    "activepartition": result.data.ap,
                    "partitions": {
                        "hparams": result.data.hparams, 
                        "hparts": result.data.hparts
                    },
                    "searchspace": result.data.search_space
                }, () => {
                    let scdata_labels = {}
                    console.log("Hparts: ", result.data.hparts)
                    for (var v of result.data.hparams){
                        // @ts-ignore
                        scdata_labels[v.name] = []
                    }
                    for (var v of result.data.hparts){
                        // @ts-ignore
                        scdata_labels[v.name] = []
                    }
                    this.setState({
                        scatterdata: scdata_labels
                    }, () => {
                        console.log("new state: ", this.state.scatterdata)
                    })
                })  
            })
        }

    }

    updateActivePartitionTab = (val: number) => {
        const cpartitions = this.state.partitions
        if (val === 1){
            this.setActivePartition(cpartitions["hparts"][0]["name"])
        }else{
            this.setActivePartition(cpartitions["hparams"][0]["name"])
        }
    }

    setSearchSpace = (ss: any) => {

        this.setState({
            searchspace: ss
        }, () => {
            console.log("Updated Search Space")
        })
    }
   
    setActivePartition = (npartition: string) => {
        const cpartitions = this.state.partitions
        const activepartition = this.state.activepartition
        
        var tcpart = Object.assign({}, cpartitions)
        console.log("TC Part 1/1 => ", tcpart)
        
        tcpart = updatePartition(tcpart, activepartition, false)
        console.log("TC Part 2/3 => ", tcpart)
        
        tcpart = updatePartition(tcpart, npartition, true)
        console.log("TC Part 3/3 => ", tcpart)

        // if (npartition.includes("__")){
        //     const part_arr = tcpart["hparts"]
        //     part_arr.forEach((v: {}, i: number) => {
        //         // @ts-ignore
        //         if (v.name === npartition){
        //             part_arr[i]["active"] = true
        //             // @ts-ignore
        //         }else if (v.active === true){
        //             part_arr[i]["active"] = false
        //         }
        //     }); 
        //     tcpart["hparts"] = part_arr
        // }else{
        //     const hparams = tcpart["hparams"]
        //     hparams.forEach((v: {}, i: number) => {
        //         // @ts-ignore
        //         if (v.name === npartition){
        //             hparams[i]["active"] = true
        //             // @ts-ignore
        //         }else if (v.active === true){
        //             hparams[i]["active"] = false
        //         }
        //     });
        //     tcpart["hparams"] = hparams
        // }
        // console.log("CPartitions = ", cpartitions)
        // console.log("TTCPartitions = ", tcpart)
        this.setState({
            "activepartition": npartition,
            "partitions": {"hparams": tcpart["hparams"], 
            "hparts": tcpart["hparts"]},
        }, () => {
            console.log("New partition set: ", npartition)
        })
    }

    // Parses live stream data
    sentinel = (streamdata: any) => {
        let json_data = JSON.parse(streamdata.data)
        // Todo: Complete with external function for actions
        if ("rsdata" in json_data){
            let scatterdata = this.state.scatterdata;
            const data = json_data["rsdata"]
            const partition = json_data["rslabel"]
            const avs = Object.assign({}, scatterdata)
            if (partition in scatterdata){
                // @ts-ignore
                avs[partition] = data.concat(avs[partition])
            }else{
                // @ts-ignore
                avs[partition] = data
            }
          
            this.setState({scatterdata: avs}, () => {
                console.log("")
            })
            
        } else if ("gadata" in json_data){
            let { scatterdata } = this.state;
            const data = json_data["gadata"]
            const partition = json_data["galabel"]
            
            // @ts-ignore
            scatterdata[partition] = data
            this.setState({scatterdata}, () => {
                console.log("")
            })
        } else if("psinfo" in json_data){
            const data = json_data["psinfo"]
            const cpartitions = this.state.partitions
            const tcpart = Object.assign({}, cpartitions)
            
            const label = data["name"]
            const pid = data["pid"]
            const ptype = label.includes("__") ? "hparts" : "hparams";

            tcpart[ptype].forEach((v: {}, i: number) => {
                // @ts-ignore
                if (v.name === label){
                    tcpart[ptype][i]["pid"] = pid
                }
            });    

            this.setState({partitions: tcpart}, () => {
                console.log("Added new PID: ", pid)
                console.log("for ", label)
            })
        }

    }

    setScatterData = (scatterdata: any, stype: string) => {
        this.setState({scatterdata}, () => {
            console.log("Updated SCD: ", stype)
        })
    }

    setToyDataset = (dataset: string) => {
        this.setState({toyDataset: dataset})
    }

    setNgen = (ngen: number) => {
        this.setState({ngen})
    }

    setAlgorithm = (algorithm: string) => {
        this.setState({algorithm})
    }
    
    setMetrics = (metrics: string) => {
        this.setState({metrics})
    }
    
    setPartitions = (partitions: any) => {
        this.setState({partitions})
    }

    setTopModels = (topN: []) => {
        this.setState({topN})
    }

    toggleWorkerPartition = (pid: number) => {
        
        const cpartitions = this.state.partitions
        const tcpart = Object.assign({}, cpartitions)
        const ptypes = Object.keys(tcpart)
        
        for (var ptype of ptypes){
            // eslint-disable-next-line no-loop-func
            tcpart[ptype].forEach((v: {}, i: number) => {
                // @ts-ignore
                if (pid === v.pid){
                    // @ts-ignore
                    tcpart[ptype][i]["running"] = false
                }
            });
        } 

        this.setState({partitions: tcpart}, () => {
            toggleWorker(pid).then((result: any) => {
                console.log(result)
            })
        })
    


        
    }

    // @ts-ignore
    visualizeConfiguration = (id) => {
        const topNClusters = this.state.topNClusters
        const pcadata = this.state.pcadata

        console.log("PCA biatch = ", pcadata)

        // @ts-ignore
        const idLabels = topNClusters[id]

        //@ts-ignore
        var data = (xy, cluster) => xy.map((x, idx) => x.concat(cluster[idx] + 1))
        const activeCluster = data(pcadata, idLabels)
        console.log("Formatted = ", activeCluster)

        console.log("ID Labels = ", idLabels)

        this.setState({activeCluster})

    }

    runConfiguration = () => {
        // Get recommended metrics & algorithm if auto
        let { algorithm, metrics, partitions, ngen } = this.state;
        const conf = {
            "dataset": [],
            "algorithm": algorithm,
            "metrics": metrics,
            "partitions": partitions,
            "ngen": ngen, // Todo: Read in Ngen
        }

        // Set all partitions to active
        const cpartitions = this.state.partitions
        const tcpart = Object.assign({}, cpartitions)
        const ptypes = Object.keys(tcpart)
        
        for (var ptype of ptypes){
            tcpart[ptype].forEach((v: {}, i: number) => {
                // @ts-ignore
                tcpart[ptype][i]["running"] = true
            });
        } 

        this.setState({partitions: tcpart, run: true}, () => {
            demoTaskRun(conf).then((result: any) => {
                console.log("Result => ", result)
                this.setState({
                    run: false, 
                    pcadata: result["data"]["pca"], 
                    topN: result["data"]["hof"],
                    topNClusters: result["data"]["mlabels"]
                }, () => {
                    // let json_data = JSON.parse(result.data)
                    console.log("Task concluded")
                    this.visualizeConfiguration(1)
                })
            })
        })
    }


    render(): React.ReactNode {
        return(
            <Container maxWidth="xl">
                <CAppBar/>
                <Grid container spacing={2}  paddingTop={2}> 
                    <Grid item xs={4}>
                        <Box sx={{ minWidth: 275 }}>
                            <TaskConfiguration 
                                {...this.state}
                                setNgen={this.setNgen}
                                setToyDataset={this.setToyDataset}
                                setAlgorithm={this.setAlgorithm}
                                setMetrics={this.setMetrics}
                                runConfiguration={this.runConfiguration}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={8}>
                        <Analytics 
                            {...this.state} 
                            toggleWorker={this.toggleWorkerPartition}
                            setActivePartition={this.setActivePartition}
                            updateTabPartition={this.updateActivePartitionTab}
                            updateSearchSpace={this.setSearchSpace}
                        />
                    </Grid>
                    
                    
                    <Grid item xs={4}>
                        <Box sx={{ minWidth: 275 }}>
                            <EDA 
                                {...this.state}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        <ModelSummary  
                            visualizeCluster={this.visualizeConfiguration}
                            {...this.state}/> 
                            
                    </Grid>
                    <Grid item xs={4}>
                        <Clusters 
                            {...this.state}/>
                    </Grid>
                   
                </Grid>
            </Container>
        )
    }
}
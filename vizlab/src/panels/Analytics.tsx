import * as React from 'react';
import { Grid, Paper, Box, Chip, CircularProgress } from '@mui/material';
import SquarePanelCard from '../components/SquarePanelCard';
import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors';

import PlayIcon from '@mui/icons-material/PlayArrow';

import DatasetSelector from '../components/DatasetSelector';
import AlgorithmSelector from '../components/AlgorithmSelector';


import Bubble from '../charts/Bubble';
import Scatter from '../charts/Scatter';
import ScatterHistory from '../charts/ScatterHistory';

import BasicTabs from '../components/BasicTabs';

import ColorToggleButton from '../components/Toggler';
import { CHARTLABELS_MULTI_CVI } from "../constants/metrics_algorithms";


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

export interface AnalyticsProps {
    partitions: any
    scatterdata: any
    searchspace: any
    activepartition: string
    metrics: string
    updateSearchSpace: (ss: any) => void
    setActivePartition: (partition: string) => void
    updateTabPartition: (index: number) => void
    toggleWorker: (pid: number) => void
}

export interface AnalyticsState{
    hparams: {},
    hparts: {},
    searchspace: {},
    metricLabel: string
    scatterview: string

}


export default class Analytics extends React.Component<AnalyticsProps, AnalyticsState> {

    constructor(props: AnalyticsProps){
        super(props)
        this.state = {
            hparams: [],
            hparts: {},
            searchspace: {},
            metricLabel: "",
            scatterview: "cov" // default
        }
    }

    componentDidUpdate(prevProps: AnalyticsProps, prevState: AnalyticsState){
        if (prevProps.partitions !== this.props.partitions){
            this.setState({hparams: this.props.partitions.hparams})
            this.setState({hparts: this.props.partitions.hparts})
            // this.setState({searchspace: this.props.searchspace})
            console.log("Search space (Partitions) = ", this.state.searchspace)
        }

        if (prevProps.searchspace !== this.props.searchspace){
            console.log("Search space = ", this.props.searchspace)
            // this.setState({searchspace: this.props.searchspace})
        }


        // if((prevProps.streamcount !== this.props.streamcount)){
        //     console.log("Stream Count Data")

        //     const scd = this.props.scatterdata
        //     const pscd = prevProps.scatterdata
        //     const ap = this.props.activepartition

        //     console.log("Prev SC data = ", pscd)
        //     console.log("New SC data = ", scd)
        //     console.log("AP = ", ap)
        // }

        // if((prevProps.scatterdata !== this.props.scatterdata)){
        //     console.log("Analytics:: SCATTER DATA: Change")
        // }

    }

    toggle2DCharts = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string,
    ) => {
        this.setState({scatterview: newAlignment})
    }

    

    render(): React.ReactNode {
        const { hparams, hparts, scatterview, searchspace } = this.state
        return(
            // <SquarePanelCard suptitle={"Hyper-partitions, hyper-parameters, Top N"} title={""}>
            <SquarePanelCard suptitle={"Hyper-partitions, hyper-parameters, Top N "} title={"Profiler"}>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <BasicTabs 
                            hparams={hparams} 
                            hparts={hparts} 
                            searchspace={this.props.searchspace} 
                            toggleWorker={this.props.toggleWorker}
                            vizpart={this.props.setActivePartition} 
                            updateAP={this.props.updateTabPartition}
                            updateSearchSpace={this.props.updateSearchSpace}
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <Box>
                            <ColorToggleButton 
                                {...this.state}
                                toggle2DCharts={this.toggle2DCharts}
                            />
                            {scatterview === "cov" ? 
                                <Scatter {...this.props}/> :
                                <ScatterHistory {...this.props}/>
                            }
                            
                        </Box>
                    
                    </Grid>
                </Grid>
                
            </SquarePanelCard>
        )
    }
}
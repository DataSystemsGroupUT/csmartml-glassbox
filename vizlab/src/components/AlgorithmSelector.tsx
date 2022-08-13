import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Divider, Stack  } from '@mui/material';
import { FormControl, MenuItem, Button, InputLabel } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ListSubheader from '@mui/material/ListSubheader';

import { purple } from '@mui/material/colors';
import { PassThrough } from 'stream';

import { LABELED_ALGORITHMS_DICT, LABELED_MULTI_CVI_DICT, LABELED_SINGLE_CVI_DICT } from "../constants/metrics_algorithms";

// Todo: Move to style file
const Input = styled('input')({
    display: 'none',
});

// Todo: Move to style file
const ButtonStyle = {
    backgroundColor: purple[900]
}

export interface AlgorithmSelectorState {
    algorithm: string
    metrics: string
}

export interface AlgorithmSelectorProps {
    metrics: string
    algorithm: string
    setAlgorithm: (algorithm: string) => void
    setMetrics: (algorithm: string) => void
}

export default class AlgorithmSelector extends React.Component<AlgorithmSelectorProps, AlgorithmSelectorState> {
    constructor(props: AlgorithmSelectorProps){
        super(props)
        this.state = {
            algorithm: "auto",
            metrics: "auto",
        }
    }

    componentDidUpdate(prevProps: AlgorithmSelectorProps, prevState: AlgorithmSelectorState){

    }

    componentDidMount(){
    }

    selectAlgorithm = (algorithm: string) =>{ 
        this.setState({algorithm})
        this.props.setAlgorithm(algorithm)
    }
    
    selectMetric = (metrics: string) =>{ 
        this.setState({metrics})
        this.props.setMetrics(metrics)
    }

    expMenuItem = () => {
        let menulist: any = []
        Object.entries(LABELED_ALGORITHMS_DICT).forEach(
            ([key, value]) => menulist.push(<MenuItem value={key}>{value}</MenuItem>)
        );
        return menulist
    }

    expGroupedMenu = () => {
        let singleCVIs: any = []
        Object.entries(LABELED_SINGLE_CVI_DICT).forEach(
            ([key, value]) => singleCVIs.push(<MenuItem value={key}>{value}</MenuItem>)
        );
        
        let multiCVIs: any = []
        Object.entries(LABELED_MULTI_CVI_DICT).forEach(
            ([key, value]) => multiCVIs.push(<MenuItem value={key}>{value}</MenuItem>)
        );

        return [singleCVIs, multiCVIs]
    }



    render(): React.ReactNode {
        let { algorithm, metrics } = this.state;
        let algMenu = this.expMenuItem()
        let [single_metrics, multi_metrics] = this.expGroupedMenu()

        return(
            <Stack direction="row" alignItems="center" spacing={2} sx={{paddingTop: 2, paddingBottom: 1}}>
                <FormControl sx={{m: 2, minWidth: 170}}>
                    <InputLabel id="ss-label">Select algorithm</InputLabel>
                    <Select 
                        labelId="ss-label" 
                        id="ss-standard" 
                        label="Select dataset" 
                        value={algorithm}
                        onChange={(e) => this.selectAlgorithm(e.target.value)}>
                            <MenuItem value={"auto"}>Auto</MenuItem>
                            {algMenu}
                            {/* <MenuItem value={"db"}>DBSCAN</MenuItem>
                            <MenuItem value={"kmeans"}>KMeans</MenuItem> */}
                    </Select>
                </FormControl>
                {/* <Divider orientation="vertical" flexItem> </Divider> */}
                <FormControl sx={{m: 2, minWidth: 170}}>
                    <InputLabel id="ss-label">Select metric(s)</InputLabel>
                    <Select 
                        labelId="ss-label" 
                        id="ss-standard" 
                        label="Select metric(s)" 
                        value={metrics}
                        onChange={(e) => this.selectMetric(e.target.value)}>
                            <MenuItem value={"auto"}>Auto</MenuItem>
                            <ListSubheader> Single CVI </ListSubheader>
                            {single_metrics}
                            <ListSubheader> Multi-CVI </ListSubheader>
                            {multi_metrics}
                    </Select>
                </FormControl>
            
            </Stack>
        )
    }

}
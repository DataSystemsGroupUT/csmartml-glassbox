import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Divider, Stack  } from '@mui/material';
import { FormControl, MenuItem, Button, InputLabel } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { purple } from '@mui/material/colors';
import { PassThrough } from 'stream';

// Todo: Move to style file
const Input = styled('input')({
    display: 'none',
});

// Todo: Move to style file
const ButtonStyle = {
    // backgroundColor: purple[900]
}

export interface DatasetSelectorState {
    dataset: string
}

export interface DatasetSelectorProps {
    toyDataset: string
    setToyDataset: (dataset: string) => void
}

export default class DatasetSelector extends React.Component<DatasetSelectorProps, DatasetSelectorState> {
    constructor(props: DatasetSelectorProps){
        super(props)
        // this.selectDemoDataset = this.selectDemoDataset.bind(this)
        this.state = {dataset: "iris"}
    }

    componentDidUpdate(prevProps: DatasetSelectorProps, prevState: DatasetSelectorState){

        if (prevProps.toyDataset !== this.props.toyDataset){
            // Todo: Load new chart data
        }
    }

    componentDidMount(){

    }

    // selectDemoDataset = (event: SelectChangeEvent) =>{ 
    selectDemoDataset = (ds: string) =>{ 
        this.setState({dataset: ds})
        this.props.setToyDataset(ds)
    }

    render(): React.ReactNode {
        let { dataset } = this.state;
        return(
            <Stack direction="row" alignItems="center" spacing={2} sx={{paddingTop: 2}}>
                <FormControl sx={{m: 2, minWidth: 140}}>
                    <InputLabel id="ss-label">Select dataset</InputLabel>
                    <Select 
                        labelId="ss-label" 
                        id="ss-standard" 
                        label="Select dataset" 
                        value={dataset}
                        onChange={(e) => this.selectDemoDataset(e.target.value)}>
                            <MenuItem value={"iris"}>iris</MenuItem>
                            <MenuItem value={"flame"}>flame</MenuItem>
                    </Select>
                </FormControl>
                <Divider orientation="vertical" flexItem>
                    OR
                </Divider>
                <label htmlFor="contained-button-file">
                    <Input accept="image/*" id="contained-button-file" multiple type="file" />
                    <Button variant="outlined" component="span" style={ButtonStyle}>
                    Upload CSV 
                    </Button>
                </label>
            
            </Stack>
        )
    }

}
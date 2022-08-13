import * as React from 'react';
import { Divider, Stack } from '@mui/material';
import SquarePanelCard from '../components/SquarePanelCard';
import { Fab, Slider, Box, Typography} from '@mui/material';
import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors';

import PlayIcon from '@mui/icons-material/PlayArrow';
import CircularProgress from '@mui/material/CircularProgress'; 

import DatasetSelector from '../components/DatasetSelector';
import AlgorithmSelector from '../components/AlgorithmSelector';
import { couldStartTrivia } from 'typescript';



const fabStyle = {
    float: "right",
    top: -70,
    padding: 1,
    color: purple[50]
  };

const marks = [
  {
    value: 0,
    label: '0',
  },
  {
    value: 50,
    label: '50',
  },
]


function valuetext(value: number) {
    return `${value}°C`;
}
const iOSBoxShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

const CustomSlider = styled(Slider)(({ theme }) => ({
    color: theme.palette.mode === 'dark' ? '#3880ff' : '#3880ff',
    height: 2,
    padding: '15px 0',
    '& .MuiSlider-thumb': {
      height: 28,
      width: 28,
      backgroundColor: '#fff',
      boxShadow: iOSBoxShadow,
      '&:focus, &:hover, &.Mui-active': {
        boxShadow:
          '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          boxShadow: iOSBoxShadow,
        },
      },
    },
    '& .MuiSlider-valueLabel': {
      fontSize: 13,
      fontWeight: 'normal',
      top: 60,
      backgroundColor: 'unset',
      color: theme.palette.text.primary,
      '&:before': {
        display: 'none',
      },
      '& *': {
        background: 'transparent',
        color: theme.palette.mode === 'dark' ? '#fff' : '#000',
      },
    },
    '& .MuiSlider-track': {
      border: 'none',
    },
    '& .MuiSlider-rail': {
      opacity: 0.5,
      backgroundColor: '#bfbfbf',
    },
    '& .MuiSlider-mark': {
      backgroundColor: '#bfbfbf',
      height: 8,
      width: 1,
      '&.MuiSlider-markActive': {
        opacity: 1,
        backgroundColor: 'currentColor',
      },
    },
  }));


export interface TaskConfigProps {
    toyDataset: string
    algorithm: string
    metrics: string
    run: boolean
    setNgen: (ngen: number) => void
    setToyDataset: (dataset: string) => void
    setAlgorithm: (algorithm: string) => void
    setMetrics: (metric: string) => void
    runConfiguration: () => void
}

export interface TaskConfigState {
    runConfig: boolean
    ngen: number
}


export default class TaskConfiguration extends React.Component<TaskConfigProps, TaskConfigState> {

    constructor(props: TaskConfigProps){
        super(props)
        this.state = {
            runConfig: false,
            ngen: 10
        }
    }

    componentDidUpdate (prevProps: TaskConfigProps, prevState: TaskConfigState){
        if((prevProps.run !== this.props.run)){
            this.setState({runConfig: this.props.run})
        }

        if((prevState.ngen !== this.state.ngen)){
            console.log("New NGEN = ", this.state.ngen)
            this.props.setNgen(this.state.ngen)
        }

    }

    handleRunConfiguration = () => {
        const rcstate = this.state.runConfig
        this.setState({runConfig: !rcstate})

        this.props.runConfiguration()
    }

    handleSliderChange = (
        event: Event, value: number | Array<number>, activeThumb: number
    ) => {
        //@ts-ignore
        this.props.setNgen(value)
    }
    

    render(): React.ReactNode {
        const rcstate = this.state.runConfig

        return(
            <SquarePanelCard suptitle={"Select dataset, algorithm, metrics"} title={""}>
                <DatasetSelector {...this.props}/>
                <Divider/>
                <AlgorithmSelector {...this.props}/>
                <Divider/>
                <Box sx={{ width: 300, paddingTop: 2 }}>
                    <Typography gutterBottom> Run budget (# Generations)</Typography>
                    <CustomSlider
                        aria-label="NGEN"
                        defaultValue={10}
                        getAriaValueText={valuetext}
                        step={1}
                        valueLabelDisplay="on"
                        color="secondary"
                        marks={marks}
                        max={50}
                        onChange={this.handleSliderChange}
                    />
                </Box>
                <Fab 
                    color="secondary" 
                    aria-label="add" 
                    onClick={this.handleRunConfiguration}
                    sx={fabStyle} >
                        { rcstate ? <CircularProgress color={"inherit"}/> : <PlayIcon />}
                        
                </Fab>
                {/* <Stack direction="row" alignItems="center" spacing={5}> 
                    <Box sx={{ width: 250, paddingTop: 2 }}>
                        <Typography variant="subtitle1"> Number of Generations</Typography>
                        <Slider
                            aria-label="Temperature"
                            defaultValue={30}
                            getAriaValueText={valuetext}
                            step={10}
                            valueLabelDisplay="auto"
                            color="secondary"
                            marks
                        />
                    </Box>
                        <Fab color="secondary" aria-label="add">
                            <PlayIcon />
                        </Fab>
                    <Box>

                    </Box>
                </Stack> */}
                
            </SquarePanelCard>
        )
    }
}
import * as React from 'react';
import { Box, Typography, Stack, Chip, CircularProgress } from '@mui/material';
import SquarePanelCard from '../components/SquarePanelCard';
import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors';

import PlayIcon from '@mui/icons-material/PlayArrow';

import DatasetSelector from '../components/DatasetSelector';
import AlgorithmSelector from '../components/AlgorithmSelector';

import EnhancedTable from '../components/EnhancedTable';

export interface ModelSummaryProps {
    topN: []
    visualizeCluster: (id: Number) => void
}


export default class ModelSummary extends React.Component<ModelSummaryProps, {}> {

    constructor(props: ModelSummaryProps){
        super(props)
    }

    

    render(): React.ReactNode {
        return(
            <SquarePanelCard suptitle={"Top Model Summary"} title={""}>
               
                <EnhancedTable
                    selectModel={this.props.visualizeCluster}
                    topN={this.props.topN}/>
            </SquarePanelCard>
        )
    }
}
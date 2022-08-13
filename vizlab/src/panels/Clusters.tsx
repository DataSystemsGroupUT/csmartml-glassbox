import * as React from 'react';
import SquarePanelCard from '../components/SquarePanelCard';
import { VictoryChart, VictoryScatter, VictoryTheme} from 'victory';

export interface ClusterProps {
    activeCluster: []
    pcadata: []
}

export interface ClusterState {
    selectedCluster: []
}

export default class Clusters extends React.Component<ClusterProps, ClusterState> {

    constructor(props: ClusterProps){
        super(props)
        this.state = {
            selectedCluster: []
        }
    }

    componentDidUpdate(prevProps: ClusterProps, prevState: {}){
        if (prevProps.activeCluster !== this.props.activeCluster){
            console.log("Active Cluster changed")
            this.setState({selectedCluster: this.props.activeCluster})
        }
    }

    assignClusters = () => {

    }

    render(): React.ReactNode {
        const selectedCluster = this.state.selectedCluster
        const clustColors = ["tomato", "#8bc34a", "purple", "#DCE775", "#00796B", "#006064"]

        return(
            <SquarePanelCard suptitle={"Visualize Clusters"} title={""}>
                <React.Fragment>
                <VictoryChart
                    height={350}
                    width={500}
                    theme={VictoryTheme.material}>

                    <VictoryScatter
                        style={{ data: 
                            // @ts-ignore
                            { fill: ({ datum }) => datum[2] <= 5 ? clustColors[datum[2]] : "tomato" } 
                        }}
                        size={7}
                        data={selectedCluster}
                        x={0}
                        y={1}
                    />
                    </VictoryChart>
            </React.Fragment>
                
            </SquarePanelCard>
        )
    }
}
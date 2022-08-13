import React from "react";
import * as V from 'victory';
import {default as dummy} from '../data/run_stats.json';

// Dummy Data
// {'P0': ['threshold'], 'P1': ['threshold', 'n_clusters'], 'P2': ['branching_factor'], 'P3': ['branching_factor', 'n_clusters'], 'P4': ['n_clusters']}
// console.log(dummy.data)

// const yellow200 = "#FFF59D";
// const deepOrange600 = "#F4511E";
// const lime300 = "#DCE775";
// const lightGreen500 = "#8BC34A";
// const teal700 = "#00796B";
// const cyan900 = "#006064";

// #c43a31: Default darkred

function lineargrad(n: number){
    let category = Math.floor(n/2)
    const gradientArray = ["#FFF59D", "#F4511E", "#DCE775", "#8BC34A", "#00796B", "#006064", "#F4511E", "#DCE775", "#8BC34A"]
    return gradientArray[category]
}

export default class Bubble extends React.Component {

    constructor(props: any) {
        super(props);
    }
    
    state = {
        data: dummy.data
    }
    render(): React.ReactNode {
        return (
            <V.VictoryChart
            theme={V.VictoryTheme.material}
            domain={{ x: [-950, 1200.0], y: [-1500, 500] }}
            style={{ 
                parent: {
                    border: "2px solid #ccc",
                }
            }}
            containerComponent={<V.VictoryZoomContainer 
                zoomDomain={{x: [-950, 1200.0], y: [-1500, 500]}} /> }
            >
                <V.VictoryScatter
                    groupComponent={<V.VictoryClipContainer/>}
                    style={{ 
                        parent: {
                            paddingTop: 0
                        },
                        data: { 
                            // @ts-ignore
                            fill: ({ datum }) => lineargrad(datum.ngen ) 
                        } 
                    }}
                    size={7}
                    
                    bubbleProperty="i_index"
                    maxBubbleSize={10}
                    minBubbleSize={1}
                    
                    data = {this.state.data}
                    // data = {dummy.data}
                    // @ts-ignore
                    labels={({ datum }) => `[${datum.ngen}] I-Index=${parseFloat(datum.i_index).toFixed(2)}`}
                    labelComponent={<V.VictoryTooltip />}
                    
                    x="modified_hubert_t"
                    y="banfeld_raferty"
                />

                <V.VictoryAxis dependentAxis 
                    label={"Banfeld Raferty (MIN)"}
                    style= {{
                        axisLabel: {fontSize: 9, padding: 30},
                        tickLabels: {fontSize: 9, padding: 5}
                    }}
                    orientation="left"
                />
                <V.VictoryAxis 
                    label={"Modified Hubert T (MAX)"}
                    style= {{
                        axisLabel: {fontSize: 9, padding: 30},
                        tickLabels: {fontSize: 9, padding: 5}
                    }}
                    orientation="top"
                />
                <V.VictoryLegend x={40} y={20}
                    width={200}
                    title="Generations"
                    titleOrientation="left"
                    orientation="horizontal"
                    rowGutter={{top: 4}}
                    symbolSpacer={5}
                    style={{ border: { stroke: "black" }, title: {fontSize: 9}, labels: {fontSize: 9, marginRight:10}, data: {justifyContent: 'center'} }}
                    colorScale={["#FFF59D", "#F4511E", "#DCE775", "#8BC34A", "#00796B", "#006064", "#F4511E", "#DCE775", "#8BC34A"]}
                    data={[
                        { name: "1-2" }, { name: "3-4" }, { name: "5-6" }, { name: "7-8" }, { name: "9-10" }
                    ]}
                />
            </V.VictoryChart>
        )
    }
}


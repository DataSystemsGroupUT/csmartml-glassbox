import React from "react";
import * as V from 'victory';
import { CHARTLABELS_MULTI_CVI } from "../constants/metrics_algorithms";

import {default as dummy} from '../data/run_stats.json';

let colors = ["#CD5C5C", "#FFBF00", "#9FE2BF", "#CCCCFF", "#008080"]



export interface ScatterProps {
    scatterdata: any
    activepartition: string
    metrics: string
}

export interface ScatterState {
    metricLabel: string,
    renderdata: []
}


export default class Scatter extends React.Component<ScatterProps, ScatterState> {

    constructor(props: ScatterProps){
        super(props)
        this.state = {
            metricLabel: "",
            renderdata: []
        }
    }

    componentDidMount = () => {
        const scd = this.props.scatterdata
        const ap = this.props.activepartition
        const ml = this.props.metrics

        if (Object.keys(scd).length > 0){
            const apd = scd[ap]
            console.log("Active SCD data: ", scd)
            if (apd !== undefined){
                this.setActiveData(apd)
            }
        }

        if (ml !== "auto"){
            //@ts-ignore
            this.setState({metricLabel: CHARTLABELS_MULTI_CVI[ml][0]})
        }
    }

    componentDidUpdate(prevProps: ScatterProps, prevState: ScatterState){
        // Todo: Validate for single metrics
        if((prevProps.metrics !== this.props.metrics)){
            //@ts-ignore
            this.setState({metricLabel: CHARTLABELS_MULTI_CVI[this.props.metrics][0]})
        }

        if((prevProps.scatterdata !== this.props.scatterdata)){
            console.log("SCATTER DATA: Change")
            const scd = this.props.scatterdata
            const pscd = prevProps.scatterdata
            const ap = this.props.activepartition

            const apd = scd[ap]
            const papd = pscd[ap]


            if ((papd !== apd)){
                this.setActiveData(apd)
            }else{
                const apd = scd[ap]
                if (apd !== undefined){
                    this.setActiveData(apd)
                }
            }
        }

        if((prevProps.activepartition !== this.props.activepartition)){
            const scd = this.props.scatterdata
            const ap = this.props.activepartition

            if (Object.keys(scd).length > 0){
                const apd = scd[ap]
                console.log("Active SCD data: ", scd)
                if (apd !== undefined){
                    this.setActiveData(apd)
                }
            }
        }

    }

    setActiveData = (data: any) => {
        this.setState({renderdata: data})
    }
    
    render(): React.ReactNode {
        const { metricLabel, renderdata } = this.state
        const { activepartition } = this.props

        const VXA = (
                <V.VictoryAxis dependentAxis 
                        label={metricLabel}
                        style= {{
                        axisLabel: {fontSize: 10, padding: 30}
                        }}
                />
        )

        const VXB = (
            <V.VictoryAxis 
                        label={activepartition}
                        style= {{
                            axisLabel: {fontSize: 10, padding: 30}
                        }}
                />
        )

        const HPA = (
            <V.VictoryAxis dependentAxis 
                label={activepartition.split("__")[1]}
                style= {{
                    axisLabel: {fontSize: 10, padding: 30}
                }}
            />          
        )

        const HPB = (
            <V.VictoryAxis 
                label={activepartition.split("__")[0]}
                style= {{
                    axisLabel: {fontSize: 10, padding: 30}
                }}
            />
        )

        return (
            <V.VictoryChart
                width={500}
                height={300}
                theme={V.VictoryTheme.material}>
                {activepartition.includes("__") ? (
                    <V.VictoryScatter
                        // @ts-ignore
                        size={({ datum }) => datum[2]}
                        
                        data = {renderdata}
                        // @ts-ignore
                        labels = {({ datum }) => `x: ${Number.parseFloat(datum[0]).toFixed(2)} | y: ${Number.parseFloat(datum[1]).toFixed(2)}`}
                        labelComponent={<V.VictoryTooltip/>}
                        
                        x={0}
                        y={1}
                        
                        style={{ data: { fill: "#c43a31" } }}
                        standalone={false}/>
                    
                ): (
                    <V.VictoryScatter
                        size={4}
                        data = {renderdata}
                        // @ts-ignore
                        labels = {({ datum }) => `x: ${Number.parseFloat(datum[0]).toFixed(2)} | y: ${Number.parseFloat(datum[1]).toFixed(2)}`}
                        labelComponent={<V.VictoryTooltip/>}
                        x={0}
                        y={1}

                        style={{ data: { fill: "#c43a31" } }}
                        standalone={false}
                    />               
                )}

                { !activepartition.includes("__") ? VXA : HPA}
                { !activepartition.includes("__") ? VXB: HPB}

               
            </V.VictoryChart>
        )
    }
}


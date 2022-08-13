import React from "react";
import * as V from 'victory';
import { CHARTLABELS_MULTI_CVI } from "../constants/metrics_algorithms";



export interface ScatterHistoryProps {
    scatterdata: any
    activepartition: string
    metrics: string
}

export interface ScatterHistoryState {
    metricLabel: string,
    renderdata: []
}


export default class ScatterHistory extends React.Component<ScatterHistoryProps, ScatterHistoryState> {

    constructor(props: ScatterHistoryProps){
        super(props)
        this.state = {
            metricLabel: "",
            renderdata: []
        }
    }

    componentDidMount= () => {
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

    componentDidUpdate(prevProps: ScatterHistoryProps, prevState: ScatterHistoryState){
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
        
        return (
            <V.VictoryChart
                width={500}
                height={300}
                theme={V.VictoryTheme.material}>
                {/* // domain={{ x: [0, 130], y: [0, 1.0] }}> */}

                <V.VictoryScatter
                    // @ts-ignore
                    size={activepartition.includes("__") ? ({ datum }) => datum[2] : 4}
                    data = {renderdata}
                    // @ts-ignore
                    labels = {({ datum }) => `y: ${Number.parseFloat(datum[1]).toFixed(2)}`}
                    labelComponent={<V.VictoryTooltip/>}
                    x={activepartition.includes("__") ? 5 : 4}
                    y={1}

                    style={{ data: { fill: "#c43a31" } }}
                    standalone={false}
                />
                <V.VictoryAxis dependentAxis 
                    label={metricLabel}
                    style= {{
                        axisLabel: {fontSize: 10, padding: 30}
                    }}
                />
                <V.VictoryAxis 
                    label={"# of Generations or Trials"}
                    style= {{
                        axisLabel: {fontSize: 10, padding: 30}
                    }}
                />
            </V.VictoryChart>
        )
    }
}


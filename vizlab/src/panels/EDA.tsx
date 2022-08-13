import * as React from 'react';
import SquarePanelCard from '../components/SquarePanelCard';
import { VictoryChart, VictoryBoxPlot} from 'victory';

import { getDemoCSV } from '../service/DemoDataService';

const papa = require("papaparse")

export interface EDAProps {
    toyDataset: string
}

export interface EDAState {
    data: any[]
}

class ClusterDataset {
    N: number
    nFeat: number
    features: any[]
    dataset: any[]
    
    constructor(data: any){
        this.nFeat = data[0].length - 1
        this.N = data.length
        this.features = this.featLabels()
        this.dataset = this.formatDataset(data)
    }

    featLabels() {
        let features = []
        for(var _i = 1; _i <= this.nFeat; _i++){
            features.push(`X${_i}`)
        }
        return features // Todo: make dict instad
    }

    formatDataset(data: any){ // for display ion VictoryBoxPlot
        var ds: any = {}
        data.forEach((inst: any[]) => {
            for(var _i = 1; _i <= this.nFeat; _i++){
                const key = `${_i}` 
                const val = parseFloat(inst[_i - 1])
                if(key in ds){
                    ds[key] = ds[key].concat([val])
                }else{
                    ds[key] = [val]
                }

            }
        })
        return ds
    }

    boxplotData(){
        var bpdata: any = []
        for(const [k, values] of Object.entries(this.dataset)){
            bpdata.push({x: parseInt(k), y: values})
        }
        return bpdata
    }

}

export default class EDA extends React.Component <EDAProps, EDAState> {

    constructor(props: EDAProps){
        super(props)
        this.state = {
            data: []
        }
    }

    componentDidMount(){
        this.loadToyDataset(this.props.toyDataset)
    }

    componentDidUpdate(prevProps: EDAProps, prevState: EDAState){
        if (prevProps.toyDataset !== this.props.toyDataset){
            this.loadToyDataset(this.props.toyDataset)
        }
    }

    loadToyDataset = async(dsname: string) => {
        let data = await getDemoCSV(dsname)
        papa.parse(data, {
            complete: this.parseCSV
        });
    }

    parseCSV = (csv: any) => {
        const data = csv.data
        const cd = new ClusterDataset(data)
        this.setState({data: cd.boxplotData()})
    }

    render(): React.ReactNode {
        const { data } = this.state
        return(
            <SquarePanelCard suptitle={"Explore Dataset"} title={""}>
                <React.Fragment>
                    <VictoryChart domainPadding={20}>
                        <VictoryBoxPlot
                            boxWidth={20}
                            data={data}
                        />
                    </VictoryChart>
            </React.Fragment>
                
            </SquarePanelCard>
        )
    }
}
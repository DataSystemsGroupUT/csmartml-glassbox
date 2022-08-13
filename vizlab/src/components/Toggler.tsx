import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

// export default function ColorToggleButton(props: any) {
//   const [alignment, setAlignment] = React.useState('cov');
 
//   // const handleChange = (
//   //   event: React.MouseEvent<HTMLElement>,
//   //   newAlignment: string,
//   // ) => {
//   //   setAlignment(newAlignment);
//   // };



export interface CTBProps {
  scatterview: string
  toggle2DCharts: (a: any, b: any) => void
}

export interface CTBState {
  activetab: string
}

export default class ColorToggleButton extends React.Component<CTBProps, CTBState>{
  constructor(props: CTBProps){
    super(props)
    this.state = {
      activetab: "cov"
    }
  }

  componentDidUpdate(prevProps: CTBProps, prevState: CTBState){
    if((prevProps.scatterview !== this.props.scatterview)){
      this.setState({activetab: this.props.scatterview})
    }
  }

  render(): React.ReactNode {
    const { activetab } = this.state
    return (
      <ToggleButtonGroup
        color="primary"
        value={activetab}
        exclusive
        onChange={this.props.toggle2DCharts}
        sx={{float: "right", marginBottom: -5, marginTop: 1}}
      >
        <ToggleButton value="cov">Coverage</ToggleButton>
        <ToggleButton value="hist">History</ToggleButton>
      </ToggleButtonGroup>
    );
  }
}
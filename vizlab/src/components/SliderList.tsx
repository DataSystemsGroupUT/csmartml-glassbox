import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

interface Partition{
  name: string
  pid: number
  val: []
  active: boolean
  running: boolean
}

function get_ss_range(ss: {}, param: any, is_start:boolean){
    var ix = is_start ? 0 : 1
    console.log("SS = ", ss)
    console.log("Param = ", param)
    // @ts-ignore
    var val = ss[param][0][ix]
    return val
}

export default function SliderList(props: any) {
    const [checked, setChecked] = React.useState([0]);
    // const [svalue, setValue] = React.useState<number[]>([20, 37]);
    const ss = props.ss
    var ss_temp = props.ss

    // const handleChange = (event: Event, newValue: number | number[]) => {
    //     setValue(newValue as number[]);
    // };


    // const define_range = (val: number, ss: {}, param: any, is_start: boolean) => {
    const define_range = (event: object)  => {
        // @ts-ignore
        var new_val = event.target.value
        // @ts-ignore
        var param = event.target.id
        console.log("New val: ", new_val)
        console.log("Param:  ", param)
        
        // @ts-ignore
        var curr_range = ss_temp[param][0]
        console.log("Curr range:  ", curr_range)
        ss_temp[param][0][0] = Number(new_val) 
        console.log("New range:  ", ss_temp)

        // Update Search space
        console.log(props)
        props.uss(ss_temp)
    }

  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {props.man.map((value: Partition) => {
        const labelId = `checkbox-list-label-${value}`;

        return (
          <ListItem
            key={value.name}>
                {/* <Box sx={{ m: 1 }} /> */}
                <Box sx={{width: '100%'}}>
                    {/* <Stack spacing={1} direction="row" sx={{ mb: 1 }} alignItems="left"> */}
                    <Grid container spacing={0}>
                        <Grid item xs={7}>
                            <Typography 
                                variant="overline" 
                                // gutterBottom
                                >
                                    {value.name}
                            </Typography>
                        </Grid>
                        <Grid xs={5}>
                            <Stack spacing={1} direction="row">
                            <TextField
                                    id={value.name}
                                    label="min"
                                    defaultValue={get_ss_range(ss, value.name, true)}
                                    variant="standard"
                                    onChange={define_range}
                                />
                                <TextField
                                    id="max-val"
                                    label="max"
                                    defaultValue={get_ss_range(ss, value.name, false)}
                                    variant="standard"
                                />
                                {/* <TextField
                                    id="max-val"
                                    label="step"
                                    defaultValue="10.00"
                                    variant="standard"
                                /> */}
                            </Stack>
                        </Grid>
                        
                        
                        {/* <Slider
                            getAriaLabel={() => 'Temperature range'}
                            value={svalue}
                            onChange={handleChange}
                            valueLabelDisplay="auto"
                            getAriaValueText={valuetext}
                            marks={marks}
                        /> */}
                    </Grid>
                </Box>
                
            
          </ListItem>
        );
      })}
    </List>
  );
}

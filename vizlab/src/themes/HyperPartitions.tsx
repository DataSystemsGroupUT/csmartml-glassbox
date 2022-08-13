import React from "react";
import Grid from "@mui/material/Grid"
import Container from "@mui/material/Container"
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Scatter from "../charts/Scatter";
import Bubble from "../charts/Bubble";
import Divider from '@mui/material/Divider';

import { Typography } from '@mui/material';


// Todo: Re-design as reusable chart•box
function ChartBox(){
    return (
        <Box sx={{color: 'text.secondary'}}>  KMeans Algorithm </Box>
    )
}
const bull = (
    <Box
      component="span"
      sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
      •
    </Box>
  );

const card = (
    <React.Fragment>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Recommended
        </Typography>
        <Typography variant="h5" component="div">
          OPTICS
        </Typography>
        {/* <Typography sx={{ mb: 1.5 }} color="text.secondary">
          clustering
        </Typography> */}
        <Box sx={{ flexGrow: 1, paddingBottom: 3, paddingTop: 2 }}>
            <Grid container spacing={1}>
                <Grid item xs>
                    <Chip label="n_clusters"/>
                </Grid>
                <Grid item>
                    <Chip label="n_init" variant="outlined"/>
                </Grid>
                <Grid item xs>
                    <Chip label="max_iter" variant="outlined"/>
                </Grid>
                <Grid item xs>
                    <Chip label="tol" variant="outlined"/>
                </Grid>
            </Grid>
        </Box>
        
        
        
        
        <Divider variant="middle" />
        
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </React.Fragment>
  );


export default class HyperPartitions extends React.Component {

    render(): React.ReactNode {
        return (
            <Container>
                <Grid 
                container 
                padding={2}
                marginTop={2}
                direction={"row"}
                justifyContent={"center"}
                spacing={1}>
                    
                    <Grid
                        justifyContent={"center"} 
                        item 
                        paddingLeft={50}
                        xs={4}>
                            <Box sx={{ minWidth: 275 }}>
                                <Card variant="outlined">{card}</Card>
                            </Box>
                    </Grid>
                    <Grid
                        justifyContent={"center"} 
                        item 
                        // paddingLeft={50}
                        xs={8}>
                             <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center'
                                }}>
                                {/* <Typography variant="h4" > Hyper-Partitions Bubble Chart </Typography> */}
                                <Bubble/>
                            </Box>
                    </Grid>
                </Grid>
            </Container>
            
        )
    }
}

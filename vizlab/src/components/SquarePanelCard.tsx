import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Divider, Box, Typography, CardContent, Card } from '@mui/material';

const Input = styled('input')({
    display: 'none',
  });

const cardStyle = {
    display: "block",
    transitionDuration: "0.3s",
    height: "25vw"
}

  export default function SquarePanelCard(props: any){
    return (
        <Card variant="outlined" style={cardStyle}>
             <React.Fragment>
            <CardContent>
                <Box sx={{paddingLeft: 2}}>
                    <Typography sx={{ fontSize: 15 }} color="text.primary" gutterBottom>
                        {props.suptitle}
                    </Typography>
                    <Typography variant="h5" component="div">
                        {props.title}
                    </Typography>
                </Box>
                <Box sx={{padding: 2}}> {/** Content */}
                    <Divider/>
                    {props.children}
                </Box>
            </CardContent>
        </React.Fragment>

        </Card>
       
    )
}
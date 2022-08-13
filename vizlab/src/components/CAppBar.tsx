import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';


export default function CAppBar(props: any){
    return (
        <AppBar position="static" sx={{
            bgcolor: "#c51162"
        }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ align: 'center',  mr: 2, display: { xs: 'none', md: 'flex' }}}
                    >
                    CSmartML: Interactive AutoClustering
                    </Typography>
                </Toolbar>
            </Container>
        </AppBar>
    )
}
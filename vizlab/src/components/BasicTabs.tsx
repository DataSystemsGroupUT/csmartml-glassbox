import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Divider } from '@mui/material';
import CheckboxList from "./CheckboxList";
import SliderList from './SliderList';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0, paddingTop: 2 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs(props: any) {
  const [value, setValue] = React.useState(0);
  
  const params = props.hparams
  const parts = props.hparts
  const vizpart = props.vizpart
  const updateAP = props.updateAP
  const updateSearchSpace = props.updateSearchSpace
  const toggleWorker = props.toggleWorker
  const searchSpace = props.searchspace

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    updateAP(newValue);
  };

  
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="hparameters" {...a11yProps(0)} />
          <Tab label="partitions" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <CheckboxList man={params} viz={vizpart} tw={toggleWorker}/>
        {/* <CheckboxList searchSpace={params} viz={vizpart} tw={toggleWorker}/> */}
        
        <Divider sx={{mt: 3}}/>
          <Box sx={{m: 1, mt: 1}}>
            <Typography variant="button" gutterBottom component="div">
              Configure Search Space
            </Typography>
          </Box>
          
        <Divider/>

        <SliderList 
            man={params} 
            ss={searchSpace} 
            uss={updateSearchSpace}
            />
      
      </TabPanel>
      <TabPanel value={value} index={1}>
        <CheckboxList man={parts} viz={vizpart} tw={toggleWorker}/>
      </TabPanel>
      
    </Box>
  );
}

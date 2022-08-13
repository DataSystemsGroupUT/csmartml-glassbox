import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ToggleButton from '@mui/material/ToggleButton';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';

interface Partition{
  name: string
  pid: number
  val: []
  active: boolean
  running: boolean
}
export default function CheckboxList(props: any) {
  const [checked, setChecked] = React.useState([0]);

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleProcessToggle = () => {

  }

  // Todo: Pass prop (function) to update active partition
  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {props.man.map((value: Partition) => {
        const labelId = `checkbox-list-label-${value}`;

        return (
          <ListItem
            key={value.name}
            secondaryAction={
                <IconButton edge="end" aria-label="visible" 
                  color={value.active ? "primary" : "default"}
                  disabled={value.pid === null} 
                  onClick={() => props.viz(value.name)}>
                    {value.active ? <VisibilityIcon/> : <VisibilityOffIcon/> }
                </IconButton>
              }
            disablePadding>
            {/* <ListItemButton role={undefined} onClick={handleToggle(value.pid)} disabled={value.pid === null} dense> */}
            <ListItemButton role={undefined} disabled={value.pid === null} dense>
              <ListItemIcon sx={{"min-width": 0}}>
                <IconButton edge="start" aria-label="visible" 
                    disabled={value.pid === null} 
                    color={value.active ? "primary" : "default"}
                    onClick={() => props.tw(value.pid)}>

                  { value.running ? 
                      <PauseCircleIcon /> : <PlayCircleIcon /> 
                  }
                  
                </IconButton>
              </ListItemIcon>
              <ListItemText id={labelId} primary={value.name} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}

import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';


import { BrowserRouter as Router, Route, Link } from "react-router-dom";

export const mainListItems = (
  <div>
    <ListItem button component={Link} to="/">
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>
    <ListItem button component={Link} to="/items">
      <ListItemIcon>
        <ShoppingCartIcon />
      </ListItemIcon>
      <ListItemText primary="Items" />
    </ListItem>
    <ListItem button component={Link} to="/schools">
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Schools" />
    </ListItem>
    
  </div>
);

export const secondaryListItems = (
  <div>
    
    <ListSubheader inset>Important Ops</ListSubheader>
    <ListItem button component={Link} to="/addserviceengineer">
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Add Service Engineer" />
    </ListItem>
    <ListItem button component={Link} to="/assignitem">
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Assign Item to School" />
    </ListItem>
    <ListItem button component={Link} to="/assignserviceengineer">
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Assign Service Engg" />
    </ListItem>
    <ListItem button component={Link} to="/viewschoolmessages">
    <ListItemIcon>
      <AssignmentIcon />
    </ListItemIcon>
    <ListItemText primary="School User's Messages" />
    </ListItem>
    <ListItem button component={Link} to="/viewservicemessages">
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Service Engg's Messages" />
    </ListItem>
  </div>
);
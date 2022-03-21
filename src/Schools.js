
import React, { useState, useEffect } from "react";
import clsx from 'clsx';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import Title from './Title';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import firebase from './services/firebaseDb';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));


export default function Schools(){ 
  let database = firebase.database();

  const [fb, setFb] = useState();
  const [schools, setSchools] = useState([]);
  const dataRows= [];

  useEffect(() => {
    firebase.database().ref('schools').on('value', (snap)=>{
      const data = snap.val();
      setFb(data);
      // console.log(fb);
      return;
    });
    }, []); 
  
  const schoolsData = [];
  function createData(code, schoolName, name, villageName, district, serviceName) {
    return { code, schoolName, name, villageName, district, serviceName };
  }

  if(fb){
    // console.log(fb);
    var disKeys = Object.keys(fb);
    for(var i=0;i<disKeys.length;i++){
      fb[disKeys[i]]["code"] =  disKeys[i];
      schoolsData[i] = fb[disKeys[i]];
    }
    console.log("type of schoolsData is: "+typeof(schoolsData));
    schoolsData.forEach((item, i) => {
      dataRows.push(createData(item.code, item.schoolName, item.name, item.villageName, item.district, item.serviceName));
    });
  }

  const classes = useStyles();
  
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  console.log("in schools");
  console.log(fb);

  return fb ? (
    <TableContainer component={Paper}>
    <Table className={classes.table} aria-label="school table">
      <TableHead>
        <TableRow>
          <TableCell>School Code</TableCell>
          <TableCell align="right">School Name</TableCell>
          <TableCell align="right">Name</TableCell>
          <TableCell align="right">Village Name</TableCell>
          <TableCell align="right">District</TableCell>
          <TableCell align="right">Service Name</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {dataRows.map((row) => (
          <TableRow key={row.name}>
            <TableCell component="th" scope="row">
              {row.code}
            </TableCell>
            <TableCell align="right">{row.schoolName}</TableCell>
            <TableCell align="right">{row.name}</TableCell>
            <TableCell align="right">{row.villageName}</TableCell>
            <TableCell align="right">{row.district}</TableCell>
            <TableCell align="right">{row.serviceName}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
  ) : (
    <div>Loading...</div>
  );
}

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
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';

import firebase from './services/firebaseDb';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));


export default function AssignItem() {
    
  const classes = useStyles();
  const [serviceName, setServiceName] = useState();
  const [serviceNumber, setServiceNumber] = useState();
 

 

   function handleButtonPress (event, value) {
    var updates ={};
    
    if(serviceName && serviceNumber){
        var object1 = {
            "name": serviceName
        }
        updates[`users/${serviceNumber}`] = object1;


        firebase.database().ref().update(updates);
        document.getElementById("uploading").innerHTML = "succesfully published!";
    }
    else{
        alert("Fill all relevant fields");
    }    
   }
  return(
    <FormControl className={classes.formControl}>

        <TextField 
        id="service-name" 
        label="Enter Service Engineer Name" 
        variant="outlined" 
        onChange={e => setServiceName(e.target.value)}
        style={{ width: 400, margin:12 }}
        />

        <TextField 
        id="service-number" 
        label="Enter Service Engineer Number" 
        variant="outlined" 
        onChange={e => setServiceNumber(e.target.value)}
        style={{ width: 400, margin:12 }}
        />

        
        <Button 
        variant="contained" 
        color="primary"
        style={{margin:12}}
        onClick={handleButtonPress}
        >
        Publish Changes
        </Button>
        <div id="uploading">

        </div>
    </FormControl>
    );
}

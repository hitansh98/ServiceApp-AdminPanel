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
  const [schools, setSchools] = useState();
  const [service, setService] = useState();
  const [schoolData, setSchoolData] = useState();
  const [itemName, setItemName] = useState();
  const [serviceData, setServiceData] = useState();
  const [itemCode, setItemCode] = useState();
  const [itemType, setItemType] = useState();
  const [serial, setSerial] = useState();

  function handleSchoolChange (event, value) {
    setSchoolData(value);
    console.log("changed value to: "+ value["schoolCode"]);
   }

  function handleServiceChange (event, value) {
    setServiceData(value);
    console.log("changed value to: "+ value["name"]);
   }

   function handleButtonPress (event, value) {
    var updates ={};
    console.log(schoolData);
    console.log(serviceData);
    
    if(schoolData && serviceData){
        var object1 = {
            "schoolId": schoolData["number"],
            "schoolName": schoolData["schoolName"].split('-')[1].trim(),
            "schoolCode": schoolData["schoolCode"],
        }
        updates[`users/${serviceData["number"]}/schools/${schoolData["schoolCode"]}`] = object1;

        var object2 = {
            "serviceName": serviceData["name"],
        }
        updates[`schoolUser/${schoolData["number"]}/services/${serviceData["number"]}`] = object2;

        firebase.database().ref().update(updates);
        document.getElementById("uploading").innerHTML = "succesfully published!";
    }
    else{
        alert("Fill all relevant fields");
    }    
   }


  useEffect(() => {
    firebase.database().ref('users').on('value', (snap)=>{
      const data = snap.val();
      setService(data);
      // console.log(fb);
      return;
    });

    firebase.database().ref('schoolUser').on('value', (snap)=>{
        const data = snap.val();
        setSchools(data);
        return;
    });
    }, []); 
  
  const servicesData = [];
  const schoolsData = [];
  var options = [];
//   function createData(_id, iconName, itemType, name) {
//     return { _id, iconName, itemType, name };
//   }

  if(service && schools){
    // console.log(fb);
    var disKeysSchools = Object.keys(schools);
    for(var i=0;i<disKeysSchools.length;i++){
      schoolsData[i] = {
        "number" : disKeysSchools[i],
        "schoolCode": schools[disKeysSchools[i]]["schoolCode"],
        "schoolName":  schools[disKeysSchools[i]]["schoolCode"]+" - "+ schools[disKeysSchools[i]]["schoolName"],
        };
    }
    var disKeysServices = Object.keys(service);
    for(var i=0;i<disKeysServices.length;i++){
        service[disKeysServices[i]]["number"] =  disKeysServices[i];
        servicesData[i] = service[disKeysServices[i]];
    }
  }

  return (service && schools) ?
    (
    <FormControl className={classes.formControl}>
        <Autocomplete
        id="school"
        options={schoolsData}
        getOptionLabel={(option) => option.schoolName}
        style={{ width: 400, margin:12 }}
        onChange={handleSchoolChange}
        renderInput={(params) => <TextField {...params} label="Select or Enter  School" variant="outlined" />}
        />

        <Autocomplete
        id="service"
        options={servicesData}
        getOptionLabel={(option) => option.name}
        style={{ width: 400, margin:12 }}
        onChange={handleServiceChange}
        renderInput={(params) => <TextField {...params} label="Select or Enter Service Engineer's name" variant="outlined" />}
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
    ) : (
        <div>Loading...</div>
    );
}

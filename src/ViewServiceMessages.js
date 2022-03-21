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

  const servicesData = [];
  const schoolsData =[];
  const grievancesData = [];
  const messagesData = [];
  const dataRows=[];


export default function ViewServiceMessages() {
    
  const classes = useStyles();
  const [service, setService] = useState();
  const [serviceData, setServiceData] = useState();
  const [school, setSchool] = useState();
  const [message, setMessage] = useState();
  const [messageData, setMessageData] = useState();
  const [schoolData, setSchoolData] = useState();
  const [grievance, setGrievance] = useState();
  const [grievanceData, setGrievanceData] = useState();
  

  function handleServiceChange (event, value) {
    setServiceData(value);
    console.log("changed value to: "+ value["number"]+ " " + value["name"]);
   }

  function handleSchoolChange (event, value) {
    setSchoolData(value);
    console.log("changed value to: "+ value["nameWithCode"]);
   }

   function handleGrievanceChange (event, value) {
    setGrievanceData(value);
    console.log("changed value to: "+ value["grievance"]);
   }


   useEffect(() => {
    firebase.database().ref('users').on('value', (snap)=>{
        const data = snap.val();
        setService(data);
        return;
    });
    }, []); 
  
//   const schoolsData = [];
  var messageTypeData = [];
  var options = [];
//   function createData(_id, iconName, itemType, name) {
//     return { _id, iconName, itemType, name };
//   }

  if(service){
    // console.log(fb);
    var disKeysServices = Object.keys(service);
    for(var i=0;i<disKeysServices.length;i++){
      servicesData[i] = {
        "number" : disKeysServices[i],
        "name": service[disKeysServices[i]]["name"],
        };
      }
    }

    if(serviceData && !school){
        // console.log(school);
        // console.log("service data chosen is: "+JSON.stringify(serviceData));
      firebase.database().ref(`users/${serviceData["number"]}/schools/`).on('value', (snap)=>{
          const data = snap.val();
          console.log("firebase data is"+JSON.stringify(data));
          setSchool(data);
          // console.log(message);
          // console.log("messages data is "+ messagesData);
          return;
      });
      console.log("loop test 1");
      }

    // console.log(school);

    if(school){
      var disKeysSchool = Object.keys(school);
      for(var i=0;i<disKeysSchool.length;i++){
        schoolsData[i] = {
            "nameWithCode" : school[disKeysSchool[i]]["schoolCode"] + " - " + school[disKeysSchool[i]]["schoolName"],
            "number" : school[disKeysSchool[i]]["schoolId"],
            "name": school[disKeysSchool[i]]["schoolName"],
            };
        }
    }

    if(schoolData && !grievance){
        firebase.database().ref(`grievances/${schoolData["number"]}/`).on('value', (snap)=>{
            const data = snap.val();
            console.log("firebase grievance data rcvd is: "+JSON.stringify(data));
            setGrievance(data);
            // console.log(message);
            // console.log("messages data is "+ messagesData);
            return;
        });
        console.log("loop test 2");
    }

    if(grievance){
        var disKeysGrievance = Object.keys(grievance);
        for(var i=0;i<disKeysGrievance.length;i++){
            // console.log("inside loop 4");
            if(grievance[disKeysGrievance[i]]["service"] == serviceData["number"]){
                grievancesData[i] = grievance[disKeysGrievance[i]];
            }  
        }
    }

    if(grievanceData && !message){
        firebase.database().ref(`messages/${serviceData["number"]}/${grievanceData["grievanceId"]}/${schoolData["number"]}`).on('value', (snap)=>{
            const data = snap.val();
            setMessage(data);
            console.log(message);
            return;
        });
        console.log("loop test 3");
    }

    function createData(content) {
        return { content };
    }

    if(message){
        var disKeysMessage = Object.keys(message);
        for(var i=0;i<disKeysMessage.length;i++){
            message[disKeysMessage[i]]["id"] =  disKeysMessage[i];
            messagesData[i] = { "content": message[disKeysMessage[i]]["from"]+ ": " + message[disKeysMessage[i]]["message"]+ "  "+ new Date((message[disKeysMessage[i]]["time"])).toLocaleString() }
        }

        if(dataRows.length<1){
            messagesData.forEach((item, i) => {
                dataRows.push(createData(item.content));
            });
            console.log("data rows are of length "+ JSON.stringify(dataRows.length));
        }
    }
    
    

    // var disKeysServices = Object.keys(service);
    // for(var i=0;i<disKeysServices.length;i++){
    //     service[disKeysServices[i]]["number"] =  disKeysServices[i];
    //     servicesData[i] = service[disKeysServices[i]];
    // }
  
//   console.log("length of messages data"+ messagesData.length);
  return (service) ?
    (
    <FormControl className={classes.formControl}>
        <Autocomplete
        id="service"
        options={servicesData}
        getOptionLabel={(option) => option.name}
        style={{ width: 400, margin:12 }}
        onChange={handleServiceChange}
        renderInput={(params) => <TextField {...params} label="Select or Enter Service Engineer" variant="outlined" />}
        />

        <Autocomplete
        id="school-user"
        options={schoolsData}
        getOptionLabel={(option) => option.nameWithCode}
        style={{ width: 400, margin:12 }}
        onChange={handleSchoolChange}
        renderInput={(params) => <TextField {...params} label="Select or Enter School" variant="outlined" />}
        />

        <Autocomplete
        id="grievance"
        options={grievancesData}
        getOptionLabel={(option) => option.grievanceId}
        style={{ width: 400, margin:12 }}
        onChange={handleGrievanceChange}
        renderInput={(params) => <TextField {...params} label="Select or Enter Grievance" variant="outlined" />}
        />  

        {(messagesData.length > 0) ? (<TableContainer component={Paper}>
                <Table className={classes.table} aria-label="messages table">
                <TableHead>
                    <TableRow>
                    <TableCell>Messages</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dataRows.map((row) => (
                    <TableRow key={row.contents}>
                        <TableCell component="th" scope="row">
                        {row.content}
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>)  : (<div>  </div>) }

    </FormControl>
    ) : (
        <div>Loading...</div>
    );
}

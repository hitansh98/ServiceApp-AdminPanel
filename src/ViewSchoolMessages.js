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

  const schoolsData = [];
  const messagesData = [];
  const dialogMessagesData = [];
  const dataRows=[];
  const grievancesData = [];
  const servicesData = [];
  const datesData = [];


export default function ViewSchoolMessages() {
    
  const classes = useStyles();
  const [schools, setSchools] = useState();
  const [messageType, setMessageType] = useState();
  const [service, setService] = useState();
  const [schoolData, setSchoolData] = useState();
  const [itemName, setItemName] = useState();
  const [itemCode, setItemCode] = useState();
  const [itemType, setItemType] = useState();
  const [serial, setSerial] = useState();
  const [messageData, setMessageData] = useState();

  function Dialogflow(params){

    const [date, setDate] = useState();
    const [dateData, setDateData] = useState();
    const [message, setMessage] = useState();

    useEffect(()=>{
        firebase.database().ref(`dialogMessages/${schoolData["number"]}/1234567890/`).on('value', (snap)=>{
            const data = snap.val();
            setDate(data);
            console.log("reached inside dialog service");
            return;
        });
    },[]);

    if(date){
        var disKeysDates = Object.keys(date);
        // console.log("just dates are: "+disKeysDates);
        for(var i=0;i<disKeysDates.length;i++){
            date[disKeysDates[i]]["date"] =  disKeysDates[i];
            datesData[i] = {
                "date" : date[disKeysDates[i]]["date"]
            };
        }
    }

    function handleDatesChange(event, value){
        setDateData(value);
        console.log("changed value to: "+ value["date"]);
    }


    if(dateData && !message){
        firebase.database().ref(`dialogMessages/${schoolData["number"]}/1234567890/${dateData["date"]}`).on('value', (snap)=>{
            const data = snap.val();
            setMessage(data);
            // console.log(message);
            // console.log("messages data is "+ messagesData);
            return;
        });
    }

    function createData(content) {
        return { content };
    }

    if(message){
        // console.log("in the rednern loop");
      var disKeysMessages = Object.keys(message);
      for(var i=0;i<disKeysMessages.length;i++){
          message[disKeysMessages[i]]["id"] =  disKeysMessages[i];
          // messagesData[i] = message[disKeysMessages[i]];
          dialogMessagesData[i] = { "content": message[disKeysMessages[i]]["from"]+ ": " + message[disKeysMessages[i]]["message"]+ "  "+ new Date((message[disKeysMessages[i]]["time"])).toLocaleString() }
      }
      
      console.log("formatted messages are: "+ (dialogMessagesData));
      console.log("data Rows value: "+ dataRows);
      if(dataRows.length<1){
          dialogMessagesData.forEach((item, i) => {
              dataRows.push(createData(item.content));
          });
        //   console.log("maintaining message: "+message);
          params.setMessageData(dialogMessagesData);
          console.log("data rows are of length "+ JSON.stringify(dataRows.length));
      }
    }
    if(messageType){
        return(
            <div>
                <Autocomplete
                id="date"
                options={datesData}
                getOptionLabel={(option) => option.date}
                style={{ width: 400, margin:12 }}
                onChange={handleDatesChange}
                renderInput={(params) => <TextField {...params} label="Select or Enter Date" variant="outlined" />}
                />
            </div>
          );
    }
    return;
  }

  function ServiceMessages(params){
    const [service, setService] = useState();
    const [serviceData, setServiceData] = useState();
    const [grievance, setGrievance] = useState();
    const [grievanceData, setGrievanceData] = useState();
    const [message, setMessage] = useState();


    function handleServicesChange(event, value){
        setServiceData(value);
        // console.log("changed value to: "+ value["serviceName"]);
        
        firebase.database().ref(`grievances/${schoolData["number"]}`).on('value', (snap)=>{
            const data = snap.val();
            setGrievance(data);
            return;
        });
     }

     if(grievance){
        var disKeysGrievances = Object.keys(grievance);
        // console.log(disKeysGrievances);
        for(var i=0;i<disKeysGrievances.length;i++){
            grievancesData[i] = grievance[disKeysGrievances[i]];
        }
            // console.log("arrived grievance: "+ grievance);
     }

     function handleGrievancesChange(event, value){
        setGrievanceData(value);
        console.log("changed value to: "+ value["grievanceId"]);
    }

    if(grievanceData && !message){
        firebase.database().ref(`messages/${schoolData["number"]}/${grievanceData["grievanceId"]}/${serviceData["number"]}`).on('value', (snap)=>{
            const data = snap.val();
            setMessage(data);
            console.log(message);
            console.log("messages data is "+ messagesData);
            return;
        });
    }

    useEffect(()=>{
    firebase.database().ref(`schoolUser/${schoolData["number"]}/services`).on('value', (snap)=>{
        const data = snap.val();
        setService(data);
        console.log("reached inside set service");
        return;
    });
    },[]);

    //   const servicesData = [];
    //   const grievancesData = [];
    //   const messagesData = [];
    //   const dataRows=[];

      if(service){
        var disKeysServices = Object.keys(service);
        for(var i=0;i<disKeysServices.length;i++){
            service[disKeysServices[i]]["number"] =  disKeysServices[i];
            servicesData[i] = service[disKeysServices[i]];
        }
      }

      function createData(content) {
        return { content };
      }

    //   console.log("message value is: "+message);
    //   console.log("required value for loop entry: "+ (message));
      if(message){
          console.log("in the rednern loop");
        var disKeysMessages = Object.keys(message);
        for(var i=0;i<disKeysMessages.length;i++){
            message[disKeysMessages[i]]["id"] =  disKeysMessages[i];
            if(message[disKeysMessages[i]]["type"] == "image"){
                messagesData[i] = { "content": message[disKeysMessages[i]]["from"]+ ": " + message[disKeysMessages[i]]["imageUrl"]+ "  "+ new Date((message[disKeysMessages[i]]["time"])).toLocaleString() }
            }
            else{
                messagesData[i] = { "content": message[disKeysMessages[i]]["from"]+ ": " + message[disKeysMessages[i]]["message"]+ "  "+ new Date((message[disKeysMessages[i]]["time"])).toLocaleString() }
            }
        }
        
        console.log("formatted messages are: "+ (messagesData));
        console.log("data Rows value: "+ dataRows);
        if(dataRows.length<1){
            messagesData.forEach((item, i) => {
                dataRows.push(createData(item.content));
            });
            console.log("maintaining message: "+message);
            params.setMessageData(messagesData);
            console.log("data rows are of length "+ JSON.stringify(dataRows.length));
        }
      }

       if(messageType){
        return(
            <div>
                <Autocomplete
                id="service"
                options={servicesData}
                getOptionLabel={(option) => option.serviceName}
                style={{ width: 400, margin:12 }}
                onChange={handleServicesChange}
                renderInput={(params) => <TextField {...params} label="Select or Enter Serviceman" variant="outlined" />}
                />
    
                <Autocomplete
                id="grievances"
                options={grievancesData}
                getOptionLabel={(option) => option.grievanceId}
                style={{ width: 400, margin:12 }}
                onChange={handleGrievancesChange}
                renderInput={(params) => <TextField {...params} label="Select or Enter the grievance" variant="outlined" />}
                />
            </div>
          );
       }
       
       return;
    }    

  function handleSchoolChange (event, value) {
    setSchoolData(value);
    console.log("changed value to: "+ value["schoolCode"]);
   }

  function handleMessageTypeChange (event, value) {
    setMessageType(value);
    console.log("changed value to: "+ value["type"]);
   }


  useEffect(() => {
    // firebase.database().ref('users').on('value', (snap)=>{
    //   const data = snap.val();
    //   setService(data);
    //   // console.log(fb);
    //   return;
    // });

    firebase.database().ref('schoolUser').on('value', (snap)=>{
        const data = snap.val();
        setSchools(data);
        return;
    });
    }, []); 
  
//   const schoolsData = [];
  var messageTypeData = [];
  var options = [];
//   function createData(_id, iconName, itemType, name) {
//     return { _id, iconName, itemType, name };
//   }

  if(schools){
    // console.log(fb);
    var disKeysSchools = Object.keys(schools);
    for(var i=0;i<disKeysSchools.length;i++){
      schoolsData[i] = {
        "number" : disKeysSchools[i],
        "schoolCode": schools[disKeysSchools[i]]["schoolCode"],
        "schoolName":  schools[disKeysSchools[i]]["schoolCode"]+" - "+ schools[disKeysSchools[i]]["schoolName"],
        };
    }

    messageTypeData = [{"type":"Dialogflow Messages"}, {"type":"Service Engineer Messages"}];

    // var disKeysServices = Object.keys(service);
    // for(var i=0;i<disKeysServices.length;i++){
    //     service[disKeysServices[i]]["number"] =  disKeysServices[i];
    //     servicesData[i] = service[disKeysServices[i]];
    // }
  }
//   console.log("length of messages data"+ messagesData.length);
  return (schools) ?
    (
    <FormControl className={classes.formControl}>
        <Autocomplete
        id="school"
        options={schoolsData}
        getOptionLabel={(option) => option.schoolName}
        style={{ width: 400, margin:12 }}
        onChange={handleSchoolChange}
        renderInput={(params) => <TextField {...params} label="Select or Enter School" variant="outlined" />}
        />

        <Autocomplete
        id="message-type"
        options={messageTypeData}
        getOptionLabel={(option) => option.type}
        style={{ width: 400, margin:12 }}
        onChange={handleMessageTypeChange}
        renderInput={(params) => <TextField {...params} label="Select or Enter Type of Messages" variant="outlined" />}
        />

        
        {messageType !=null ? (messageType["type"] == "Dialogflow Messages" ? <Dialogflow setMessageData={setMessageData}/> : <ServiceMessages setMessageData={setMessageData}/>) : <div></div>}
        {console.log("Message Dataa: "+messageData)}
        {(messageData != null) ? ( messageData[(messageData.length-1)]["from"] != 1234567890 ? (<TableContainer component={Paper}>
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
            </TableContainer>) : (<TableContainer component={Paper}>
                <Table className={classes.table} aria-label="DialogMessages table">
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
            </TableContainer>) ) : (<div>  </div>) }
        <div id="furtherForm">

        </div>

    </FormControl>
    ) : (
        <div>Loading...</div>
    );
}

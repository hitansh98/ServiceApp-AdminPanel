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
  const [items, setItems] = useState([]);
  const [schoolCode, setSchoolCode] = useState();
  const [itemName, setItemName] = useState();
  const [itemCode, setItemCode] = useState();
  const [itemType, setItemType] = useState();
  const [serial, setSerial] = useState();

  function handleSchoolChange (event, value) {
    setSchoolCode(value["code"]);
    console.log("changed value to: "+ value["code"]);
   }

  function handleItemNameChange (event, value) {
    setItemName(value["name"]);
    console.log("changed value to: "+ value["name"]);
   }

   function handleItemCodeChange (event, value) {
    setItemCode(value["_id"]);
    console.log("changed value to: "+ value["_id"]);
   }

   function handleItemTypeChange (event, value) {
    setItemType(value["itemType"]);
    console.log("changed value to: "+ value["itemType"]);
   }

   function handleItemSerialChange (event, value) {
    setSerial(value);
    console.log("changed value to: "+ value);
   }

   function handleButtonPress (event, value) {
    var updates ={};
    console.log(schoolCode);
    console.log(itemName);
    console.log(itemCode);
    console.log(itemType);
    console.log(serial);
    
    if(schoolCode && itemName && itemCode && itemType && serial){
        var object = {
            "itemType": itemType,
            "itemname": itemName,
            "serialNo": serial,
        }
        updates[`schoolitems/${schoolCode}/items/${serial}`] = object;
        firebase.database().ref().update(updates);
        document.getElementById("uploading").innerHTML = "succesfully published!";
    }
    else{
        alert("Fill all relevant fields");
    }    
   }


  useEffect(() => {
    firebase.database().ref('items').on('value', (snap)=>{
      const data = snap.val();
      setItems(data);
      // console.log(fb);
      return;
    });

    firebase.database().ref('schools').on('value', (snap)=>{
        const data = snap.val();
        setSchools(data);
        return;
    });
    }, []); 
  
  const itemsData = [];
  const schoolsData = [];
  var options = [];
//   function createData(_id, iconName, itemType, name) {
//     return { _id, iconName, itemType, name };
//   }

  if(items && schools){
    // console.log(fb);
    var disKeysSchools = Object.keys(schools);
    for(var i=0;i<disKeysSchools.length;i++){
      schoolsData[i] = {
        "code" : disKeysSchools[i],
        "schoolName":  disKeysSchools[i]+" - "+ schools[disKeysSchools[i]]["schoolName"],
        };
    }
    var disKeysItems = Object.keys(items);
    for(var i=0;i<disKeysItems.length;i++){
        itemsData[i] = items[disKeysItems[i]];
    }
  }

  if(itemName){
    options = itemsData.filter((object) => object.name == itemName);
    console.log(options);
  }
  

  return (items && schools) ?
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
        id="item-name"
        options={itemsData}
        getOptionLabel={(option) => option.name}
        style={{ width: 400, margin:12 }}
        onChange={handleItemNameChange}
        renderInput={(params) => <TextField {...params} label="Select or Enter Item" variant="outlined" />}
        />

        <Autocomplete
        id="item-code"
        options={options}
        getOptionLabel={(option) => option._id}
        style={{ width: 400, margin:12 }}
        onChange={handleItemCodeChange}
        renderInput={(params) => <TextField {...params} label="Select Item Code" variant="outlined" />}
        />

        <Autocomplete
        id="item-type"
        options={options}
        getOptionLabel={(option) => option.itemType}
        style={{ width: 400, margin:12 }}
        onChange={handleItemTypeChange}
        renderInput={(params) => <TextField {...params} label="Select Item Type" variant="outlined" />}
        />

        <TextField 
        id="item-serial" 
        label="Enter Serial Number" 
        variant="outlined" 
        onChange={e => setSerial(e.target.value)}
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
    ) : (
        <div>Loading...</div>
    );
}

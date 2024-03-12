import { User, UnitUser, Users } from "./user.interface";
import bcrypt from "bcryptjs";
import { v4 as random } from "uuid";
import fs from "fs";


/*
1. Read data from a file - 'users.json' if not create file.
2. It attempts to parse the data as JSON and returns it as the users object.
3.If an error occurs during the process, it logs the error and returns an empty object
*/

let users:Users = loadUsers();

function loadUsers():Users {
    
  try {
    const path = require('path');
    const filePath = '../../users.json';
    console.log('isvalid:',filePath);
    return {}
  } catch (error) {
    console.log(`Error ${error}`);
    return {}
  } 
}

function saveUsers(){

}

export {
  loadUsers,
  saveUsers
}
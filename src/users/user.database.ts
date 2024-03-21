import { User, UnitUser, Users } from "./user.interface";
import bcrypt from "bcryptjs";
import { v4 as random } from "uuid";
import fs from "fs";
import { decrypt } from "dotenv";


/*
1. Read data from a file - 'users.json' if not create file.
2. It attempts to parse the data as JSON and returns it as the users object.
3.If an error occurs during the process, it logs the error and returns an empty object
*/

let users:Users = loadUsers();

export function loadUsers():Users {
  
  const filePath = './users.json';

  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);          
  } catch (error:any) {
      if ((error).code === 'ENOENT') {
          // Handle file not found error
          
          console.error('IF File not found:', filePath);
          
          let id = random();
          
          const users = {
            "id":id,
            "username":"test123",
            "email":"sample@test.com",
            "password":"12345"
          }
  
          fs.writeFileSync("./users.json", JSON.stringify(users), "utf-8");
          console.log('first time file created.');
          // Optionally, create a default file or perform alternative actions
      } else {
          // Handle other errors
          console.error('Error occurred while reading the file:', error.message);
      }
    
      console.log(`Error ${error}`);
    
    return {}
  } 
}

export function saveUsers(){
  
  const filePath = './users.json';

  try {
    fs.writeFileSync(filePath, JSON.stringify(users), "utf-8")
    console.log(`User saved successfully!`)
  } catch (error) {
    console.log(`Error : ${error}`)
  }
}
 /*
 This function returns a promise that resolves to an array of UnitUser objects. 
 It uses Object.values(users) to extract the values (users) from the users object.
 */
 export const findAll = async (): Promise<UnitUser[]> => Object.values(users);  
 /*
 This function takes an id parameter and returns a promise that resolves to the 
 UnitUser object corresponding to that id in the users object.
 */ 
 export const findOne = async(id: string): Promise<UnitUser> => users[id];

 export const findByEmail = async(user_email: string):Promise<null | UnitUser > => {
    
    const allUsers = await findAll();

    const getUser = allUsers.find((result) => user_email == result.email);

    if(!getUser){
      return null;
    }
    
    return getUser;
 }

 export const create = async(userData: UnitUser): Promise<UnitUser | null> => {
  
  let id = random();

  let check_user = await findOne(id);

  while(check_user){
    id = random();
    check_user = await findOne(id);
  }
  
  //for password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const user :UnitUser = {
      id:id,
      username:userData.username,
      email:userData.email,
      password: hashedPassword,      
    };

    users[id] = user;
    saveUsers();

  return user;
 }

 /*
 Compare Password:
 This function takes an email and supplied_password as parameters and returns a promise that resolves to a UnitUser object if the supplied password matches the user's stored password, or null otherwise. It calls findByEmail to retrieve the user by email and then uses bcrypt.compare to compare the hashed stored password with the supplied password.
 */

 export const comparePassword = async(email:string, supplied_password:string):Promise<UnitUser | null> => {
  
   //get user data by email
   const user = await findByEmail(email);

   if(user){
      const decryptPassword = await bcrypt.compare(supplied_password, user.password);        
      
      if(!decryptPassword){
        return null;
      }
   }

  return user;
 }
 
 export const update = async(id:string, updateValues:User):Promise<UnitUser | null> => {

  const isUserExist = await findOne(id);
  
  if(!isUserExist){
      return null;
  }

  //update user password
  if(updateValues.password){
      const salt = await bcrypt.genSalt(10);
      const newPass =  await bcrypt.hash(updateValues.password, salt)

      updateValues.password = newPass;
  }
  
  users[id] = {
    ...isUserExist,
    ...updateValues
  }

  saveUsers()
    return users[id];
 }

 export const deleteUser = async(user_id:string):Promise<null | void> => {
  
  if(user_id){
    delete users[user_id];
  }
  
  saveUsers();

  return null;
 }
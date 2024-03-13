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
import express, { Request, Response, Router } from 'express';
import {StatusCodes} from "http-status-codes"
import * as database from './user.database';
import { User, UnitUser } from './user.interface';

export const userRouter = express.Router();

userRouter.get('/getUser', async(req:Request, res:Response) => {
    
    try {
        const users = await database.loadUsers();    
        return res.status(200).send({'msg':users})
    } catch (error) {
        console.log(error)
        return res.send(500).send({msg:error});
    }    
});

userRouter.get('/:id', async(req:Request, res:Response) => {

})

/* 
User registration
Method: POST
Request URL: http://localhost:7000/user/registration

Request Body: raw - json
```json
{    
    "username":"sarfaraz",
    "email":"sfz@sample.com",
    "password":"12345"
}
```
Status code: 201 Created
Response 
```json
{
    "newUser": {
        "id": "e931bed5-358d-40d3-b04a-ddbbe072ea0d",
        "username": "sarfaraz",
        "email": "sfz@sample.com",
        "password": "$2a$10$zVpW8YVswYMaTQtFX52kuuS/b4PDbPjsnhCvryYJjTqbbDmwQ5zRW"
    }
}
```
*/ 
userRouter.post('/registration', async(req:Request, res:Response) => {
    try{
        const { username, email, password } = req.body;

        if(!username || !email || !password){
            return res.status(StatusCodes.BAD_REQUEST)
            .json({error : `Please provide all the required parameters..`});
        }

        const user = await database.findByEmail(email);
        
        if (user) {
            return res.status(StatusCodes.BAD_REQUEST).json({error : `This email has already been registered..`})
        }

        const newUser = await database.create(req.body);
        return res.status(StatusCodes.CREATED).json({newUser});                    
    }catch(error){
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
    }
})

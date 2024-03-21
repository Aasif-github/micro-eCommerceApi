import express, { Request, Response, Router, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes"
import * as database from './user.database';
import { User, UnitUser } from './user.interface';

export const userRouter = express.Router();

userRouter.get('/getUser', async (req: Request, res: Response) => {

    try {
        const users = await database.loadUsers();
        return res.status(200).send({ 'msg': users })
    } catch (error) {
        console.log(error)
        return res.send(500).send({ msg: error });
    }
});

userRouter.get('/:id', async (req: Request, res: Response) => {

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
userRouter.post('/registration', async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(StatusCodes.BAD_REQUEST)
                .json({ error: `Please provide all the required parameters..` });
        }

        const user = await database.findByEmail(email);

        if (user) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: `This email has already been registered..` })
        }

        const newUser = await database.create(req.body);
        return res.status(StatusCodes.CREATED).json({ newUser });
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
    }
})


userRouter.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);

        if (!email || !password) {
            return res.status(StatusCodes.BAD_REQUEST)
                .json({ error: `Please provide all the required parameters..` });
        }

        const user = await database.findByEmail(email);

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: `No User Found` });
        }

        const isPasswordVarified = await database.comparePassword(email, password);
        //res.send(user);
        console.log(user);

        if (isPasswordVarified) {
            return res.status(StatusCodes.OK).json({ 'msg': 'Password Match, Welcome' });
        }
        return res.status(StatusCodes.FORBIDDEN).json({ error: `Unauthoriresed` });
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
    }
});

/*
Request-URL:http://localhost:4000/user/update/94b281e7-9c0c-489b-8eef-25306dbb776d
Request-Body:
{
    "username":"hari sado",
    "email":"Hari@gmail.com",
    "password":"12345"
}
*/
userRouter.put('/update/:id', async (req: Request, res: Response) => {

    try {
        const id = req.params.id;
        let isUserExist = await database.findOne(id);

        if(!isUserExist){
            return res.status(StatusCodes.NOT_FOUND).json({'msg':'User Not Found'});
        }

        if (isUserExist) {

            const { username, email, password } = req.body;

            if (!username || !email || !password) {
                return res.status(StatusCodes.BAD_GATEWAY).json({ 'msg': 'invalid fields.' });
            }
            // also match object keys from req body
            //  const allowedType1: Array<string> = ['username','email', 'password'];

            const allowedType = ['username', 'email', 'password'];

            let updateValue = Object.keys(req.body);

            const isKeyMatch = allowedType.every((type) => {
                //console.log(type);
                return updateValue.includes(type);
            })
            
            // check inputtype type must be string (type narrow)
            if( typeof username !== "string"|| 
                typeof email !== "string"||
                typeof password !== "string"){                                
                return res.status(StatusCodes.BAD_REQUEST).json({'msg':'bad format'});
            }
            if (isKeyMatch) {
                const updateUser = await database.update((req.params.id), req.body)

                return res.status(StatusCodes.CREATED).json(updateUser);
            }else{
                return res.status(StatusCodes.NOT_ACCEPTABLE).json({'msg':'keys not match'});
            }
        } else {
            return res.status(StatusCodes.NOT_FOUND);
        }
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});

userRouter.delete('/delete/:id', async(req:Request, res:Response) => {
    
    try {
        // check for user_id is present or not
        const user = await database.findOne(req.params.id);
        console.log(user);

        if(!user){
            return res.status(StatusCodes.NOT_FOUND).json({'err':"No user found"})                
        }    

        const isDeleted = await database.deleteUser(user.id);
      
        if(isDeleted){
            return res.status(StatusCodes.OK).json({'msg':"User Delete Successfully"});                
        }
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({'err':error});           
    }    
})
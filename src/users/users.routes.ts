import express, { Request, Response, Router } from 'express';
import {StatusCodes} from "http-status-codes"
import * as database from './user.database';
import { User, UnitUser } from './user.interface';

export const userRouter = express.Router();

userRouter.get('/getUser', async(req:Request, res:Response)=>{
    
    try {
        // const users:UnitUser = await database.loadUsers();    
        return res.status(200).send({'msg':'users loaded'})
    } catch (error) {
        console.log(error)
        return res.send(500).send({msg:error});
    }
    
});

import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { log } from "console";

import { userRouter } from "./users/users.routes"

dotenv.config();
// console.log('port',typeof process.env.PORT); // string
if(!process.env.PORT){
    console.log(`no port value is specified...`);    
}

const PORT = parseInt(process.env.PORT as string, 10)

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cors())
app.use(helmet())


//defining Routes
app.use('/user', userRouter);


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})


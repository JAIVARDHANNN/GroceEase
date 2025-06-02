import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';


const app = express();
const port = process.env.PORT || 4000;

await connectDB();

//Allow multiple origins
const allowedOrigins = ['http://localhost:5173'] //this is basically a list of allowed domains and links to acccess the bacnend localhost:400 for fetching data

//Middleware Configuration
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins , credentials : true}));



app.get('/' , (req ,res)=> res.send("API is working"));

app.listen(port , ()=>{
    console.log(`Server is running on http://localhost:${port}`)
})
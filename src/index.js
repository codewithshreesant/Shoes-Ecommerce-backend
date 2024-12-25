
import { app } from "./app.js";
import { connectDB } from "./db/index.js";

import cors from 'cors';

app.use(cors({
    origin:'*',
    credentials:true,
    methods:['GET','POST','PUT','DELETE','OPTIONS'],
}));

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`The Server is listening at PORT ${process.env.PORT || 8000}`);
    })
})
.catch(error=>console.log(`Error occured while connecting to database ${error.message}`))




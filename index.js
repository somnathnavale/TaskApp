require('dotenv').config();
const express=require('express');
const connection=require('./src/db/mongoose');
const userRouter=require('./src/routes/user');
const tasksRouter=require('./src/routes/tasks');

const PORT=process.env.PORT || 5000;
const USERNAME=process.env.MONGO_USERNAME;
const PASSWORD=process.env.MONGO_PASSWORD;
const URL=`mongodb+srv://${USERNAME}:${PASSWORD}@task-app.gepku.mongodb.net/TASK?retryWrites=true&w=majority`
connection(URL);

const app=express();

//middleware
app.use(express.json());

//routes
app.use('/users',userRouter);
app.use('/tasks',tasksRouter);

app.listen(PORT,()=>{
    console.log(`listening on PORT ${PORT}`);
})
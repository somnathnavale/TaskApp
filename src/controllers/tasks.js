const Task=require('../model/tasks');

const createTask=async(req,res)=>{
    const newTask=new Task({
        ...req.body,
        owner:req.user._id
    });

    try{
        const data=await newTask.save();
        res.status(201).json({success:true,data});
    }catch(err){
        res.status(400).json({success:false,data:err.message})
    }
}

const getAllTasks=async(req,res)=>{
    // await req.user.populate('tasks');
    // res.status(200).json({success:true,req.user.tasks});
    const match={};
    const skip=Number(req.query.skip)||0;
    const limit=Number(req.query.limit)||10;
    if(req.query.completed){
        match.completed=req.query.completed==='true'?true:false;
    }
    try{
        let tasks=Task.find({owner:req.user._id,...match});
        tasks.skip(skip).limit(limit);
        
        if(req.query.sort){
            const sortList=req.query.sort.split(',').join(' ');
            console.log(sortList);
            tasks=tasks.sort(sortList);
        }else{
            tasks=tasks.sort('createdAt')
        }
        const data=await tasks;

        res.status(200).json({success:true,data});
    }catch(err){
        res.status(500).json({success:false,data:err.message});
    }
}

const getTask=async(req,res)=>{
    const id=req.params.id;
    try{    
        const data=await Task.findOne({_id:id,owner:req.user._id});
        if(!data){
            return res.status(404).json({success:false,data:"no task with given ID"})
        }
        res.status(200).json({success:true,data});
    }catch(err){
        res.status(500).json({success:false,data:err.message});
    }
}

const updateTask=async(req,res)=>{
    const id=req.params.id;

    const updates=Object.keys(req.body);
    const validOperations=['descriptions','completed'];
    const isValid=updates.every(update=>{
        return validOperations.includes(update)
    })
    if(!isValid){
        return res.status(400).json({success:false,data:"please update valid fields only"});
    }

    try{
        const task=await Task.findOne({_id:id,owner:req.user._id});
        if(!task){
            return res.status(404).json({success:false,data:"no task with given ID"})
        }
        updates.forEach(update=>task[update]=req.body[update]);
        await task.save();
        res.status(200).json({success:true,task});
    }catch(err){
        res.status(500).json({success:true,data:err.message});
    }
}

const deleteTask=async(req,res)=>{
    const id=req.params.id;
    try{
        const data=await Task.findOneAndDelete({_id:id,owner:req.user._id});
        if(!data){
            return res.status(404).json({success:false,data:"no task with given ID"})
        }
        res.status(200).json({success:true,data});
    }catch(err){
        res.status(500).json({success:true,data:err.message});
    }
}


module.exports={createTask,getAllTasks,getTask,updateTask,deleteTask};
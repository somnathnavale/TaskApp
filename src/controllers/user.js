const sharp=require('sharp');
const User=require('../model/user');

const createUser=async(req,res)=>{
    const newUser=new User(req.body);
    try{
        const user=await newUser.save();
        const token=await user.generateAuthToken();
        res.status(201).json({success:true,data:user,token});
    }catch(err){
        res.status(400).json({success:false,data:err.message});
    }
}

const getProfile=async(req,res)=>{
    res.status(200).json({success:true,data:req.user});
}

// const getUser=async(req,res)=>{
//     const id=req.params.id;
//     try{
//         const user=await User.findById(id);
//         if(!user){
//             return res.status(404).json({success:false,data:"no user with given ID"})
//         }
//         res.status(200).json({success:true,data:user})
//     }catch(err){
//         res.status(500).json({success:false,data:err.message});
//     }
// }

const updateUser=async(req,res)=>{

    const updates=Object.keys(req.body);
    const validOperations=['name','age','password','email'];
    const isValid=updates.every(update=>validOperations.includes(update));

    if(!isValid){
        return res.status(400).json({success:false,data:"please update valid fields only"});
    }
    
    try{
        updates.forEach(update=>req.user[update]=req.body[update]);
        await req.user.save();
        res.status(200).json({success:true,data:req.user});
    }catch(err){
        res.status(400).json({success:false,data:err.message});
    }
}

const deleteUser=async(req,res)=>{
    const id=req.params.id;
    try{
        await req.user.remove();
        res.status(200).json({success:true,data:req.user});
    }catch(err){
        res.status(400).json({success:false,data:err.message});
    }
}

const loginUser=async(req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.email,req.body.password);  
        const token=await user.generateAuthToken();
        
        res.status(200).json({success:true,user,token});
    }catch(err){
        res.status(400).json({success:false,data:err.message});
    }
}

const logoutUser=async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter(token=>token.token!==req.token);
        await req.user.save();
        res.status(200).send({success:true,data:"successfully logout"});
    }catch(err){
        res.status(503).json({success:false,data:err.message});
    }
}

const logoutAll=async(req,res)=>{
    try{
        req.user.tokens=[];
        await req.user.save();
        res.status(200).send({success:true,data:"successfully logout from all devices"});
    }catch(err){
        res.status(500).json({success:false,data:err.message});
    }
}

//avatar is variable name it should matched with thunder client form data key while uploading

const uploadAvatar=async(req,res)=>{ 
    const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer();
    req.user.avatar=buffer;
    await req.user.save();
    res.json({success:true,data:'updated avatar successfully'});
}

const avatarErrorHandler=(error,req,res,next)=>{
    res.status(400).json({success:false,data:error.message});
}

const deleteAvatar=async(req,res)=>{
    try{
        console.log('hiii');
        req.user.avatar=undefined;
        await req.user.save();
        res.status(200).json({success:true,data:'avatar deleted successfully'})
    }catch(err){
        res.status(400).json({success:false,data:err.message});
    }
}

const getAvatar=async(req,res)=>{
    try{
        const user=await User.findById(req.params.id);
        if(!user || !user.avatar){
            return res.status(400).json({success:false,data:'User or User Avatar is not exist'});
        }
        res.set('Content-Type','image/png');
        res.send(user.avatar);
    }catch(err){
        res.status(400).json({success:false,data:err.message});
    }
}

module.exports={createUser,getProfile,updateUser,deleteUser,loginUser,logoutUser,logoutAll,uploadAvatar,avatarErrorHandler,deleteAvatar,getAvatar};
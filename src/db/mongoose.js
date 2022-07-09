const mongoose=require('mongoose');

const connection=async(URL)=>{
    try{
        await mongoose.connect(URL,{useNewUrlParser:true,useUnifiedTopology:true})
        console.log('connected successfully to DB');
    }catch(err){
        console.log('error while connecting DB ',err);
    }
}

module.exports=connection;
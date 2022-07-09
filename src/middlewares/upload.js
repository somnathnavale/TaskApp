const multer=require('multer');
const upload=multer({
    limits:{
        fileSize:1048576
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            cb(new Error('please upload image with extension .jpeg,.jpg,.png'));
        }   
        cb(undefined,true);
    }
})

module.exports=upload;
const express=require('express');
const auth=require('../middlewares/auth');
const upload=require('../middlewares/upload');
const {createUser, getProfile, updateUser, deleteUser, loginUser,logoutUser,logoutAll, uploadAvatar,deleteAvatar, avatarErrorHandler,getAvatar}=require('../controllers/user'); 

const router=express.Router();

//Crud user routes
router.route('/').post(createUser);
router.route('/me').get(auth,getProfile).put(auth,updateUser).delete(auth,deleteUser);

//login-logout routes
router.route('/login').post(loginUser);
router.route('/logout').post(auth,logoutUser);
router.route('/logoutAll').post(auth,logoutAll);

//profile picture -routes
router.route('/me/avatar').post(auth,upload.single('avatar'),uploadAvatar,avatarErrorHandler).delete(auth,deleteAvatar);

router.get('/:id/avatar',getAvatar);
module.exports=router;


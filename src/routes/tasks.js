const express=require('express');
const {createTask, getAllTasks, getTask, updateTask, deleteTask}=require('../controllers/tasks');
const router=express.Router();
const auth=require('../middlewares/auth');

router.use(auth);
router.route('/').post(createTask).get(getAllTasks);

router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);

module.exports=router;
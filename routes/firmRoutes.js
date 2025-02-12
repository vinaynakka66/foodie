const express=require('express');
const {addFirm}=require('../controllers/firmController');
const router=express.Router()
const {verifyToken}=require('../middlewares/verifyToken')
router.post('/addFirm',upload.single('image'),verifyToken,addFirm)

module.exports=router;
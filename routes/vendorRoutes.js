const {vendorRegister,vendorLogin,getAllVendors,getVendor}=require('../Controllers/vendorController')
const express=require('express');
const router=express.Router();
router.post('/register',vendorRegister);
router.post('/login',vendorLogin);
router.get('/getAllVendors',getAllVendors);
router.get('/getVendor/:id',getVendor);
module.exports=router;


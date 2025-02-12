const Vendor=require('../models/Vendor');
const jwt=require('jsonwebtoken');
require('dotenv').config();
exports.verifyToken=async(req,res,next)=>{
    try{
        const token=req.header("Authorization").replace("Bearer ","");
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is required",
            })
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        const vendor=await Vendor.findById(decoded.vendorId);
        if(!vendor){
            return res.status(400).json({
                success:false,
                message:"Vendor not found"
            })
        }
        req.vendorId=vendor._id;
        next();
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Invalid Token"
        })
    }
}
const Vendor=require('../models/Vendor');
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
require('dotenv').config()

//register
exports.vendorRegister=async(req,res)=>{
    try{
        const {username,email,password}=req.body;
        const vendorEmail=await Vendor.findOne({email});
        if(vendorEmail){
            return res.status(400).json({
                success:false,
                message:"Email already Exists"
            })
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const newVendor=new Vendor({
            username,
            email,
            password:hashedPassword
        });
        await newVendor.save();
        console.log("Vendor Registered");
        return res.status(201).json({
            success:true,
            message:"Vendor registered Successfully",
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

//login
exports.vendorLogin=async(req,res)=>{
    try{
        const{email,password}=req.body;
        const vendor=await Vendor.findOne({email});
        if(!vendor){
            return res.status(404).json({
                success:false,
                message:'Vendor not found. Enter correct Email'
            })
        }
        
        if(!await bcrypt.compare(password,vendor.password)){
            return res.status(400).json({
                success:false,
                message:"Incorrect Password"
            })
        }
        const payload={
            vendorId:vendor._id,
            email:vendor.email,
        }
        const token=jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"1h"})
        console.log("Vendor LoggedIn Successfully");
        return res.status(200).json({
            success:true,
            message:"Vendor LoggedIn Successfully",
            token
        })
    }
    catch(err){
        return res.status(400).json({
            success:false,
            message:'Login failed'
        })
    }
}

//get all vendors

exports.getAllVendors=async(req,res)=>{
    try{
        const vendors=await Vendor.find({}).populate('firm');
        return res.status(200).json({
            
                success:true,
                message:"All Vendors fetched Successfully",
                vendors
            
        })
    }
    catch(err){
        return res.status(400).json({
            success:false,
            message:'Login failed'
        })
    }
}


//get vendor by id

exports.getVendor=async(req,res)=>{
    try{
        const {id}=req.params;
        const vendor=await Vendor.findById(id).populate('firm');
        if(!vendor){
            return res.status(404).json({
                success:'False',
                message:"Invalid ID"
            })
        }
        return res.status(200).json({
            success:'True',
            message:"Fetched Vendor with id",
            vendor
        })
    }
    catch(err){
        return res.status(400).json({
            success:'False',
            message:"Failed to get vendor"
        })
    }
}
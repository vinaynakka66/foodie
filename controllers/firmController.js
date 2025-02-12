const multer=require('multer')
const Firm=require('../models/Firm');
const Vendor=require('../models/Vendor');
const path = require('path');

const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
      cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
  });
  const upload = multer({
    storage: storage,
  });

  //adding a firm
exports.addFirm=async(req,res)=>{
    try{
        const {firmName,area,category,region,offer}=req.body;
        const vendor=await Vendor.findById(req.vendorId);
        if(!vendor){
            res.status(404).json({
                success:false,
                message:"Vendor not found"
            })
        }
        const image = req.file ? req.file.filename : null;

        const firm=new Firm({
            firmName,area,category,region,offer,image,vendor:vendor._id
        })
        const savedFirm=await firm.save();
        vendor.firm.push(savedFirm);
        await vendor.save();
        return res.status(200).json({
            success:true,
            message:"Firm Added Successfully"
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


//get image by image name

exports.getImageByName=async(req,res)=>{
  try{
    const{imageName}=req.params;
    res.setHeader('Content-Type','image/jpeg');
    res.sendFile(path.join(__dirname,'..','uploads',imageName));
    
  }
  catch(err){
    return res.status(400).json({
      success:false,
      message:"failed to fetch Image"
    })
  }
}

exports.deleteFirmById=async(req,res)=>{
  try{
    const {firmId}=req.params;
    const deletedFirm=Firm.findByIdAndDelete(firmId);
    if(!deletedFirm){
      return res.status(404).json({
        success:false,
        message:"No Firm found"
      })
    }
    return res.json(200).json({
      success:true,
      message:"Firm Deleted Successfully"
    })
  }
  catch(err){
    return res.status(400).json({
      success:false,
      message:"failed to delete Product"
    })
  }
}
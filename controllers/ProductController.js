const multer=require('multer');
const Firm=require('../models/Firm')
const Product=require('../models/Product')
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

//add product
exports.addProduct=async(req,res)=>{
    try{
        const {productName,price,category,description,bestSeller}=req.body;
        const image = req.file ? req.file.filename : null;
        const {firmId}=req.params;
        const firm=await Firm.findById(firmId);
        if(!firm){
            return res.status(404).json({
                success:false,
                message:"Firm Not Found"
            })
        }
        const product= new Product({
            productName,price,category,description,bestSeller,image,firm:firm._id
        })
        const savedProduct=await product.save();
         firm.products.push(savedProduct._id);
         await firm.save();
         return res.status(200).json({
            success:true,
            message:"Successfully added a product to the firm"
         })

    }
    catch(err){
        console.error(err);
        return res.status(400).json({
        success:'false',
        message:"Failed to add Product"
        })
    }
}

//get products by firm id

exports.getProductByFirm=async(req,res)=>{
  try{
    const {firmId}=req.params;
    const firm=await Firm.findById(firmId);
    if(!firm){
      return res.status(200).json({
        success:false,
        response:"Firm not found"
      })
    }
    const products=await Product.find({firm:firmId}).populate('firm','firmName');
    res.status(200).json({
      success:true,
      message:"All products fetched for the firm",
      products
    })
  }
  catch(err){
    console.error(err);
    res.status(500).json({
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

//delete a product
exports.deleteProductById=async(req,res)=>{
  try{
    const {productId}=req.params;
    const deletedProduct=await Product.findByIdAndDelete(productId);
    if(!deletedProduct){
      return res.status(404).json({
        success:false,
        message:"No Product found"
      })
    }
    return res.json(200).json({
      success:true,
      message:"Product Deleted Successfully"
    })
  }
  catch(err){
    return res.status(400).json({
      success:false,
      message:"failed to delete Product"
    })
  }
}
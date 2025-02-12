const express=require('express');
const router=express.Router();
const {addProduct,getProductByFirm,getImageByName,deleteProductById}=require('../controllers/ProductController')
router.post('/addProduct/:firmId',upload.single('image'),addProduct)
router.get('/getProductByFirm/:firmId',getProductByFirm)
router.get('/uploads/:imageName',getImageByName)
router.delete('/:productId',deleteProductById)
module.exports=router;
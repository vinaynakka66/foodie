const express=require("express");
const app=express();
require('dotenv').config();
const mongoose=require('mongoose');
const vendorRoutes=require('./routes/vendorRoutes')
const PORT=process.env.PORT||4000;
const bodyParser=require('body-parser')
const firmRoutes=require('./routes/firmRoutes');
const productRoutes=require('./routes/productRoutes')
app.listen(PORT,()=>{
    console.log(`Server Started and running at ${PORT}`);
})

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("MongoDB connected successfully!");
})
.catch((error) => {
    console.error("MongoDB connection error:", error);
});

app.use(bodyParser.json())
app.use('/vendor',vendorRoutes);
app.use('/firm',firmRoutes);
app.use('/product',productRoutes);

app.use('/',(req,res)=>{
    res.send(`<h1>Welcome to Vinay's page</h1>`)
})
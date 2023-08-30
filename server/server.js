require('dotenv').config()

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Product = require('./models/productModel'); //created model & schema in productModel.js
const Purchase = require('./models/purchaseModel'); //to handle sales record
const app = express();

app.use(cors()); //enable cross-origin resource sharing and parse incoming request, do i need this?
app.use(express.json()); //enable use of express and middleware

//create data via client and store into MongoDB
app.post('/products', async (req, res) => {
    try { 
        const product = await Product.create(req.body);
        res.json(product)

    }   catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
});

//fetch products data from MongoDB database
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find(); //find ALL products
        res.json(products);
    }
    catch (error) {
        console.log(error.message);
        res.json({message: error.message})
    }
})

//if got time, figure out find like/contains/tolower etc to make search function more robust.
app.get('/products/:name', async (req, res) => {
    try {
        const productName = req.params.name;
        const product = await Product.find({"name" : productName});
        return res.json(product);
    }
    catch (error) {
        console.log(error.message);
        res.json({message: error.message})
    }
})

//find by name and update, using put request
app.put('/products/:name', async (req, res) => {
    try {
        const productName = req.params.name;
        const product = await Product.findOneAndUpdate({"name" : productName}, req.body);      
        await product.save();
        return res.json(product);
    }
    catch (error) {
        console.log(error.message);
        res.json({message: error.message})
    }
})

//delete products database.
app.delete('/products', async (req, res) => {
    const product = await Product.deleteMany();
    res.json(product);
})

//create sales record
app.post('/purchases', async (req,res) => {
    try{
        const purchase = await Purchase.create(req.body);
        res.json(purchase)
        }
  
    catch (error) {
        console.log(error.message);
        res.json({message: error.message})
    }
})

//fetch sales data from MongoDB database
app.get('/purchases', async (req, res) => {
    try {
        const purchase = await Purchase.find(); //pretty() function doesnt work?
        res.json(purchase);
    }
    catch (error) {
        console.log(error.message);
        res.json({message: error.message})
    }
})

//reduce available qty on purchase (stock)
app.patch('/products/:name', async (req, res) => {
    try {
        const productName = req.params.name;
        const reduction = req.body;
        const product = await Product.findOne({"name" : productName});
        product.quantity -= reduction.quantity;
        await product.save();
        res.json(product);
    }
    catch (error) {
        console.log(error.message);
        res.json({message: error.message})
    }
})

//delete purchases records
app.delete('/purchases', async (req, res) => {
    const purchase = await Purchase.deleteMany();
    res.json(purchase);
})

//Connect to Mongo DB. connection name: zong
mongoose.connect(process.env.DB_URI)
.then(() => {
    console.log("connected to MongoDB")
}).catch((error) => {
    console.log(error)
});

//start the server
const port = process.env.DB_PORT || 8000;
app.listen(port, () => {
    console.log(`server is running on port ${port}`); //using ` instead of ' for the ${} function
});


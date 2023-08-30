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


require('dotenv').config()

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

app.use(cors()); //enable cross-origin resource sharing and parse incoming request, do i need this?
app.use(express.json()); //enable use of express and middleware

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


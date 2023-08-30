require('dotenv').config()

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors()); //enable cross-origin resource sharing and parse incoming request, do i need this?
app.use(express.json()); //enable use of express and middleware

//start the server
app.listen(process.env.DB_PORT || 8000, () => {
    console.log(`server is running on port ${port}`); //using ` instead of ' for the ${} function
});


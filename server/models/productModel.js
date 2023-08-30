const mongoose = require('mongoose');

//create Schema for product model. (type of data)
const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter a product name"] //included validation message
        },
        quantity: {
            type: Number,
            required: true,
            default: 0
        },
        price: {
            type: Number,
            required: true,
        },
    },
      {
        timestamps: true,  //can use timestamp to update records
    }
)

//create model called 'Product' to save data.
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
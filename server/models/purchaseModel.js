const mongoose = require('mongoose');

//create Schema for product model. (type of data)
const purchaseSchema = mongoose.Schema(
    {
        name: {
            type: String,
        },
        quantity: {
            type: Number,
        },
        price: {
            type: Number,
        },
        totalPrice: {
            type: Number,
        }
    },
      {
        timestamps: true,  //can use timestamp to update records
    }
)

//create model called 'Purchase' to save data.
const Purchase = mongoose.model('Purchase', purchaseSchema);
module.exports = Purchase;
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({

    //PRODUCTS ARRAY , EACH ELEMENT HAS TWO ATTRIBUTES, PRODUCT OBJECT AND QUANTITY
    products: [
        {
            product: { type: Object, required: true },
            quantity: { type: Number, required: true }

        }
    ],

    //USER OBJECT WITH NAME AND ID
    user: {
        email: { type: String, required: true },
        userId: { type: Schema.Types.ObjectId, required: true, ref: "User" }
        
    }
});

module.exports = mongoose.model("Order", orderSchema);



const mongoose = require("mongoose");

const Schema = mongoose.Schema; 

//Everything in Mongoose starts with a Schema. 
//Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.

const productSchema = new Schema({
  title: {
    type:String,
    required : true
  },
  price: {
    type:Number,
    required:true
  },
  description : {
    type:String,
    required : true
  },
  imageUrl: {
    type:String,
    required : true
  },

  userId: {
    type: Schema.Types.ObjectId, //we have defined the type here, even if a whole object is passed, mongoose will extract the id
    ref: 'User',
    required:true
  }
});

module.exports = mongoose.model("Product", productSchema);


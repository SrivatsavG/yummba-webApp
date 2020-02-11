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
  image: {
    type:String,
    required : true
  },

  userId: {
    type: Schema.Types.ObjectId, //we have defined the type here, even if a whole object is passed, mongoose will extract the id
    ref: 'User',
    required:true
  },

  ingredients:{
    type:Array,
    required:true
  },

  servingSize: {
    type:Number,
    required:true
  },
  calories: {
    type:Number,
    required:true
  },
  totalFat: {
    type:Number,
    required:true
  },
  saturatedFat: {
    type:Number,
    required:true
  },
  transFat: {
    type:Number,
    required:true
  },
  cholestoral: {
    type:Number,
    required:true
  },
  sodium: {
    type:Number,
    required:true
  },
  totalCarbohydrate: {
    type:Number,
    required:true
  },
  dietaryFiber: {
    type:Number,
    required:true
  },
  dietaryFiber: {
    type:Number,
    required:true
  },
  fruitSugar: {
    type:Number,
    required:true
  },
  protein: {
    type:Number,
    required:true
  },
  calcium: {
    type:Number,
    required:true
  },
  iron: {
    type:Number,
    required:true
  },
  potassium: {
    type:Number,
    required:true
  },

  
});

module.exports = mongoose.model("Product", productSchema);


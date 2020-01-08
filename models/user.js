const mongoose = require("mongoose");
const Product = require('../models/product');


const Schema = mongoose.Schema;

const userSchema = new Schema({
  username:{type:String,required:true},
  email: { type: String, required: true },
  password: { type: String, required: true },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [
      {
        productId: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ]
  }
});

userSchema.methods.addToCart = function (product,quantity) {

  let newQuantity = parseInt(quantity);
  const updatedCartItems = [...this.cart.items]; //stores all items in cart

  //FIND THE INDEX AT WHICH THE PRODUCT IS LOCATED IN THE ITEMS ARRAY
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString(); // when product exists in the cart , should be == as product.id is of string type
  });

  //IF THE PRODUCT ALREADY EXISTS IN THE CART, THE cartProductIndex would be greater than or equal to 0

  if (cartProductIndex >= 0) {

    // if it exists in the cart , update the quantity
    newQuantity = parseInt(this.cart.items[cartProductIndex].quantity) + parseInt(quantity);
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {

    //add it to the cart

    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity
    });
  }

  const updatedCart = { // creates an object called updatedCart, that has a property called items 
    items: updatedCartItems //items is an array of objects. Each object consists of two properties: id and quantity
  };

  this.cart = updatedCart;
  return this.save()

}

userSchema.methods.deleteItemFromCart = function (productId) {

  // Create a new cart using filter
  // filter keeps all items where this condition is true
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId.toString() !== productId.toString();
  });

  this.cart.items = updatedCartItems;
  return this.save();
}

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
}


module.exports = mongoose.model("User", userSchema);

//   addOrder() {
//     //ORDER IS A LIST OF CART. 
// //You need to create an orders collection for every user.
//     //get the prepopulated cart items
//     //Create an object called order that stores the products in the cart and the user data
//     // Insert the cart into the order collections
//     //Empty the cart in the database and in the datastructure 

//     const db = getDb();
//     return this.getCart()
//       .then(products => {
//         const order = {
//           items: products,
//           user: {
//             _id: new ObjectId(this._id),
//             name: this.name,
//             email: this.email
//           }
//         };

//         return db.collection("orders").insertOne(order) // insert first

//       })
//       .then(result => {
//         //empty datastructure
//         this.cart = { items: [] };
//         //empty DB
//         return db.collection("users")
//           .updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       });
//   }







// const getDb = require("../util/database").getDb;
// const mongodb = require("mongodb");

// const ObjectId = mongodb.ObjectId;

// class User {
//   constructor(username, email, cart, id) {

//     this.name = username;
//     this.email = email;
//     this.cart = cart; //has items array
//     this._id = id;
//   }

//   save() {
//     const db = getDb();
//     return db.collection("users").insertOne(this);
//   }

//   addToCart(product) {

//     const db = getDb();

//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items]; //stores all items

//     //FIND THE INDEX AT WHICH THE PRODUCT IS LOCATED IN THE ITEMS ARRAY
//     const cartProductIndex = this.cart.items.findIndex(cp => {
//       return cp.productId.toString() === product._id.toString(); // when product exists in the cart , should be == as product.id is of string type
//     });

//     //IF THE PRODUCT ALREADY EXISTS IN THE CART, THE cartProductIndex would be greater than or equal to 0

//     if (cartProductIndex >= 0) {

//       // if it exists in the cart , update the quantity

//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {

//       //add it to the cart

//       updatedCartItems.push({
//         productId: new ObjectId(product._id),
//         quantity: newQuantity
//       });
//     }

//     const updatedCart = { // creates an object called updatedCart, that has a property called items 
//       items: updatedCartItems //items is an array of objects. Each object consists of two properties: id and quantity
//     };

//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: updatedCart } } // overwrite the old cart withthe new cart
//       );



//   }





//   deleteItemFromCart(productId) {

//     //Create a new cart using filter
//     const updatedCartItems = this.cart.items.filter(item => {
//       return item.productId.toString() !== productId.toString(); // filter keeps all items where this condition is true
//     });

//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: { items: updatedCartItems } } }
//       );
//   }

//   addOrder() {
//     //ORDER IS A LIST OF CART. You need to create an orders collection for every user.
//     //get the prepopulated cart items
//     //Create an object called order that stores the products in the cart and the user data
//     // Insert the cart into the order collections
//     //Empty the cart in the database and in the datastructure 

//     const db = getDb();
//     return this.getCart()
//       .then(products => {
//         const order = {
//           items: products,
//           user: {
//             _id: new ObjectId(this._id),
//             name: this.name,
//             email: this.email
//           }
//         };

//         return db.collection("orders").insertOne(order) // insert first

//       })
//       .then(result => {
//         //empty datastructure
//         this.cart = { items: [] };
//         //empty DB
//         return db.collection("users")
//           .updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       });
//   }

//   getOrders() {

//     const db = getDb();
//     return db.collection("orders").find({ "user._id": new ObjectId(this._id) })
//       .toArray();
//   }


//   static findById(userId) {
//     const db = getDb();
//     return db
//       .collection("users")
//       .findOne({ _id: new ObjectId(userId) })
//       .then(user => {
//         console.log(user);
//         return user;
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }
// }

// module.exports = User;

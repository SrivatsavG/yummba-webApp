const mongodb = require("mongodb");
const Product = require('../models/product');
const Blog = require('../models/blog');
const fileHelper = require('../util/file');

var mongoose = require('mongoose');

const ObjectId = mongodb.ObjectID;


//

//added
exports.getAddProduct = (req, res, next) => {


  let user = req.user || null;

  if (user._id.toString() == process.env.ADMIN) {
    res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      errorMessage: '',
      validationErrors: [],
      user: req.user || null,
      admin: process.env.ADMIN,

    });
  } else {
    const error = new Error(err);
    //
    error.httpStatusCode = 500;
    //when we pass next with an error as an argument, we tell express to skill all other 
    //middleware and go to the error handling middleware
    return next(error);
  }
};

//-------------------------------ORIGINAL-------------------------

// exportsddProduct = (req, res, next) => {
//   const title = req.body.title;
//   const image = req.file; // THIS CHANGED IN ORDER TO UPLOAD FILES
//   const price = req.body.price;
//   const description = req.body.description;

//   if (!image) { // THERE WILL BE NO IMAGE IF IT IS NOT PNG,JPG OR JPEG
//     //RETURN 404 PAGE
//     console.log("===========!IMAGE REACHED============");
//     return res.status(422).render("admin/edit-product", {
//       pageTitle: 'Add product',
//       path: '/admin/add-product',
//       editing: false,
//       product: {
//         title: title,
//         price: price,
//         description: description,
//         user: req.user || null,
//         admin:process.env.ADMIN
//       },
//       errorMessage: "Attached file should be of type png, jpeg or jpg",
//       validationErrors: []
//     });
//   }
//   //THIS CODE IS REACHED ONLY IF FILTER IS PASSED

//   const imageUrl = image.path; // the address in the filesystem

//   const product = new Product({
//     title: title,
//     price: price,
//     description: description,
//     imageUrl: imageUrl,
//     userId: req.user
//   });
//   product
//     .save()
//     .then(result => {
//       // console.log(result);
//       console.log('Created Product');
//       res.redirect('/admin/products');
//     })
//     .catch(err => {
//       const error = new Error(err);
//       //
//       error.httpStatusCode = 500;
//       //when we pass next with an error as an argument, we tell express to skill all other 
//       //middleware and go to the error handling middleware
//       return next(error);
//     });
// };

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.body.image;
  const price = req.body.price;
  const description = req.body.description;


  //INGREDIENTS
  var ingredients = [];

  const ingredients0 = req.body.ingredients0;
  const ingredients1 = req.body.ingredients1;
  const ingredients2 = req.body.ingredients2;
  const ingredients3 = req.body.ingredients3;
  const ingredients4 = req.body.ingredients4;
  const ingredients5 = req.body.ingredients5;
  const ingredients6 = req.body.ingredients6;
  const ingredients7 = req.body.ingredients7;
  const ingredients8 = req.body.ingredients8;
  const ingredients9 = req.body.ingredients9;
  const ingredients10 = req.body.ingredients10;
  const ingredients11 = req.body.ingredients11;
  const ingredients12 = req.body.ingredients12;

  if (req.body.ingredients0) ingredients.push(req.body.ingredients0);
  if (req.body.ingredients1) ingredients.push(req.body.ingredients1);
  if (req.body.ingredients2) ingredients.push(req.body.ingredients2);
  if (req.body.ingredients3) ingredients.push(req.body.ingredients3);
  if (req.body.ingredients4) ingredients.push(req.body.ingredients4);
  if (req.body.ingredients5) ingredients.push(req.body.ingredients5);
  if (req.body.ingredients6) ingredients.push(req.body.ingredients6);
  if (req.body.ingredients7) ingredients.push(req.body.ingredients7);
  if (req.body.ingredients8) ingredients.push(req.body.ingredients8);
  if (req.body.ingredients9) ingredients.push(req.body.ingredients9);
  if (req.body.ingredients10) ingredients.push(req.body.ingredients10);
  if (req.body.ingredients11) ingredients.push(req.body.ingredients11);
  if (req.body.ingredients12) ingredients.push(req.body.ingredients12);



  //NUTRITION
  const servingSize = req.body.servingSize;
  const calories =req.body.calories;
  const totalFat = req.body.totalFat;
  const saturatedFat = req.body.saturatedFat;
  const transFat = req.body.transFat;
  const cholestoral = req.body.cholestoral;
  const sodium = req.body.sodium;
  const totalCarbohydrate = req.body.totalCarbohydrate;
  const dietaryFiber = req.body.dietaryFiber;
  const fruitSugar = req.body.fruitSugar;
  const protein = req.body.protein;
  const calcium = req.body.calcium;
  const iron = req.body.iron;
  const potassium = req.body.potassium;

  console.log(title, price, image, description);
  console.log(ingredients);
  console.log(totalFat, saturatedFat, transFat, cholestoral, sodium, totalCarbohydrate, dietaryFiber, fruitSugar, protein, calcium, iron, potassium);




  const product = new Product({
    title: title,
    price: price,
    description: description,
    image: image,
    userId: req.user,
    ingredients: ingredients,
    servingSize:servingSize,
    calories:calories,
    totalFat: totalFat,
    saturatedFat: saturatedFat,
    transFat: transFat,
    cholestoral: cholestoral,
    sodium: sodium,
    totalCarbohydrate: totalCarbohydrate,
    dietaryFiber: dietaryFiber,
    fruitSugar: fruitSugar,
    protein: protein,
    calcium: calcium,
    iron: iron,
    potassium: potassium
  });
  product
    .save()
    .then(result => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      const error = new Error(err);
      //
      error.httpStatusCode = 500;
      //when we pass next with an error as an argument, we tell express to skill all other 
      //middleware and go to the error handling middleware
      return next(error);
    });
};

exports.getEditProduct = (req, res, next) => {

  let user = req.user || null;

  if (user._id.toString() == process.env.ADMIN) {

    const editMode = req.query.edit;
    if (!editMode) {
      return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
      .then(product => {
        if (!product) {
          return res.redirect('/');
        }
        res.render('admin/edit-product', {
          pageTitle: 'Edit Product',
          path: '/admin/edit-product',
          editing: editMode,
          product: product,
          errorMessage: null,
          validationErrors: [],
          user: req.user || null,
          admin: process.env.ADMIN
        });
      })
      .catch(err => {
        const error = new Error(err);
        //
        error.httpStatusCode = 500;
        //when we pass next with an error as an argument, we tell express to skill all other 
        //middleware and go to the error handling middleware
        return next(error);
      });

  } else {
    const error = new Error(err);
    //
    error.httpStatusCode = 500;
    //when we pass next with an error as an argument, we tell express to skill all other 
    //middleware and go to the error handling middleware
    return next(error);
  }
};

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%ORIGINAL%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// exports.postEditProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   const updatedTitle = req.body.title;
//   const updatedPrice = req.body.price;
//   const image = req.image; // CHANGED THIS FOR FILE UPLOAD
//   const updatedDesc = req.body.description;


//   Product.findById(prodId)
//     .then(foundProduct => {

//       foundProduct.title = updatedTitle;
//       foundProduct.description = updatedDesc;
//       foundProduct.price = updatedPrice;

//       if (image) { // ONLY IF IT PASSES THE FILER SET THE NEW URL
//         fileHelper.deleteFile(foundProduct.imageUrl);
//         foundProduct.imageUrl = image.path;

//       }

//       // product will be a full mongoose object. Save will update the object on its own
//       return foundProduct.save().then(result => {
//         console.log("============Product updated==========");
//         res.redirect("/admin/products");
//       })
//     })

//     .catch(err => {
//       const error = new Error(err);
//       //
//       error.httpStatusCode = 500;
//       //when we pass next with an error as an argument, we tell express to skill all other 
//       //middleware and go to the error handling middleware
//       return next(error);
//     });
// };



exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImage = req.body.image; // CHANGED THIS FOR FILE UPLOAD
  const updatedDesc = req.body.description;


  //INGREDIENTS
  var ingredients = [];

  const ingredients0 = req.body.ingredients0;
  const ingredients1 = req.body.ingredients1;
  const ingredients2 = req.body.ingredients2;
  const ingredients3 = req.body.ingredients3;
  const ingredients4 = req.body.ingredients4;
  const ingredients5 = req.body.ingredients5;
  const ingredients6 = req.body.ingredients6;
  const ingredients7 = req.body.ingredients7;
  const ingredients8 = req.body.ingredients8;
  const ingredients9 = req.body.ingredients9;
  const ingredients10 = req.body.ingredients10;
  const ingredients11 = req.body.ingredients11;
  const ingredients12 = req.body.ingredients12;

  if (req.body.ingredients0) ingredients.push(req.body.ingredients0);
  if (req.body.ingredients1) ingredients.push(req.body.ingredients1);
  if (req.body.ingredients2) ingredients.push(req.body.ingredients2);
  if (req.body.ingredients3) ingredients.push(req.body.ingredients3);
  if (req.body.ingredients4) ingredients.push(req.body.ingredients4);
  if (req.body.ingredients5) ingredients.push(req.body.ingredients5);
  if (req.body.ingredients6) ingredients.push(req.body.ingredients6);
  if (req.body.ingredients7) ingredients.push(req.body.ingredients7);
  if (req.body.ingredients8) ingredients.push(req.body.ingredients8);
  if (req.body.ingredients9) ingredients.push(req.body.ingredients9);
  if (req.body.ingredients10) ingredients.push(req.body.ingredients10);
  if (req.body.ingredients11) ingredients.push(req.body.ingredients11);
  if (req.body.ingredients12) ingredients.push(req.body.ingredients12);

  //NUTRITION
  const servingSize = req.body.servingSize;
  const calories = req.body.calories;
  const totalFat = req.body.totalFat;
  const saturatedFat = req.body.saturatedFat;
  const transFat = req.body.transFat;
  const cholestoral = req.body.cholestoral;
  const sodium = req.body.sodium;
  const totalCarbohydrate = req.body.totalCarbohydrate;
  const dietaryFiber = req.body.dietaryFiber;
  const fruitSugar = req.body.fruitSugar;
  const protein = req.body.protein;
  const calcium = req.body.calcium;
  const iron = req.body.iron;
  const potassium = req.body.potassium;


  Product.findById(prodId)
    .then(foundProduct => {
      foundProduct.servingSize = servingSize;
      foundProduct.calories = calories;
      foundProduct.title = updatedTitle;
      foundProduct.description = updatedDesc;
      foundProduct.price = updatedPrice;
      foundProduct.image = updatedImage;
      foundProduct.ingredients = ingredients;
      foundProduct.totalFat = totalFat;
      foundProduct.saturatedFat = saturatedFat;
      foundProduct.transFat = transFat;
      foundProduct.cholestoral =cholestoral;
      foundProduct.sodium = sodium;
      foundProduct.totalCarbohydrate = totalCarbohydrate;
      foundProduct.dietaryFiber = dietaryFiber;
      foundProduct.fruitSugar = fruitSugar;
      foundProduct.protein = protein;
      foundProduct.calcium = calcium;
      foundProduct.iron = iron;
      foundProduct.potassium = potassium;




      // product will be a full mongoose object. Save will update the object on its own
      return foundProduct.save().then(result => {
        console.log("============Product updated==========");
        res.redirect("/admin/products");
      })
    })

    .catch(err => {
      const error = new Error(err);
      //
      error.httpStatusCode = 500;
      //when we pass next with an error as an argument, we tell express to skill all other 
      //middleware and go to the error handling middleware
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {


  let user = req.user || null;

  if (user._id.toString() == process.env.ADMIN) {

    Product.find()
      //.populate("userId")
      .then(products => {
        res.render('admin/products', {
          prods: products,
          pageTitle: 'Admin Products',
          path: '/admin/products',
          user: req.user || null,
          admin: process.env.ADMIN
        });
      })
      .catch(err => {
        const error = new Error(err);
        //
        error.httpStatusCode = 500;
        //when we pass next with an error as an argument, we tell express to skill all other 
        //middleware and go to the error handling middleware
        return next(error);
      });

  } else {
    const error = new Error(err);
    //
    error.httpStatusCode = 500;
    //when we pass next with an error as an argument, we tell express to skill all other 
    //middleware and go to the error handling middleware
    return next(error);
  }


};

exports.deleteProduct = (req, res, next) => {


  let user = req.user || null;

  if (user._id.toString() == process.env.ADMIN) {

    //ASYNCHRONOUSE====>delete requests are not allowed to have req.body(convention)
    //const prodId = req.body.productId; IS REMOVED

    const prodId = req.params.productId;

    //delete from system
    Product.findByIdAndRemove(prodId)
      .then(foundProduct => {
        if (!foundProduct) {
          return next(new Error('Product not found'));
        }

        // fileHelper.deleteFile(foundProduct.imageUrl);
        // //delete from database

        return Product.findByIdAndRemove(prodId) //mongoose method        
      })
      .then(() => {
        console.log('DESTROYED PRODUCT');

        //ASYNCHRONOUSE=====>NOT REDIRECT ANYMORE
        //res.redirect('/admin/products');

        res.status(200).json({ message: 'success' });
      })
      .catch(err => {
        //ASYCNCHRONOUSE===>CANNOT USE OUR DEFAULT ERROR HANDLER
        // const error = new Error(err);
        // //
        // error.httpStatusCode = 500;
        // //when we pass next with an error as an argument, we tell express to skip all other 
        // //middleware and go to the error handling middleware
        // return next(error);

        res.status(500).json({ message: 'deleting failed' });
      });
  } else {
    const error = new Error(err);
    //
    error.httpStatusCode = 500;
    //when we pass next with an error as an argument, we tell express to skill all other 
    //middleware and go to the error handling middleware
    return next(error);
  }
};


exports.getAddBlog = (req, res, next) => {
  let user = req.user || null;

  if (user._id.toString() == process.env.ADMIN) {
    res.render('admin/add-blog', {
      pageTitle: 'Add Blog',
      path: '/admin/add-blog',
      user: req.user || null,
      admin: process.env.ADMIN,

    });
  } else {
    const error = new Error(err);
    //
    error.httpStatusCode = 500;
    //when we pass next with an error as an argument, we tell express to skill all other 
    //middleware and go to the error handling middleware
    return next(error);
  }
}



exports.postAddBlog = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const blogUrl = req.body.blogUrl;

  const blog = new Blog({
    title: title,
    description: description,
    imageUrl: imageUrl,
    blogUrl: blogUrl
  });

  blog
    .save()
    .then(result => {
      // console.log(result);
      console.log('Created Blog');
      res.redirect('/admin/add-blog');
    })
    .catch(err => {
      const error = new Error(err);
      //
      error.httpStatusCode = 500;
      //when we pass next with an error as an argument, we tell express to skill all other 
      //middleware and go to the error handling middleware
      return next(error);
    });
}

exports.deleteBlog = (req, res, next) => {
  console.log("REACHED ROUTE");

  let user = req.user || null;

  if (user._id.toString() == process.env.ADMIN) {

    //ASYNCHRONOUS====>delete requests are not allowed to have req.body(convention) so we do in params

    const blogId = req.params.blogId;

    //delete from system
    Blog.findByIdAndRemove(blogId)
      .then(foundBlog => {
        if (!foundBlog) {
          return next(new Error('Blog not found'));
        }

        // fileHelper.deleteFile(foundProduct.imageUrl);
        //delete from database

        return Blog.findByIdAndRemove(blogId) //mongoose method        
      })
      .then(() => {
        console.log('DESTROYED BLOG');

        //ASYNCHRONOUS=====>NOT REDIRECT ANYMORE
        //res.redirect('/admin/products');

        res.status(200).json({ message: 'success' });
      })
      .catch(err => {
        //ASYCNCHRONOUSE===>CANNOT USE OUR DEFAULT ERROR HANDLER
        // const error = new Error(err);
        // //
        // error.httpStatusCode = 500;
        // //when we pass next with an error as an argument, we tell express to skip all other 
        // //middleware and go to the error handling middleware
        // return next(error);

        res.status(500).json({ message: 'deleting failed' });
      });
  } else {
    const error = new Error(err);
    //
    error.httpStatusCode = 500;
    //when we pass next with an error as an argument, we tell express to skill all other 
    //middleware and go to the error handling middleware
    return next(error);
  }
}
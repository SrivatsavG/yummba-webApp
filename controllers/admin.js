const mongodb = require("mongodb");
const Product = require('../models/product');
const fileHelper = require('../util/file');

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
      admin:process.env.ADMIN,
      
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
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");

  console.log(title);
  console.log(imageUrl);


  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
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
          admin:process.env.ADMIN
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
  const updatedImageUrl = req.body.imageUrl; // CHANGED THIS FOR FILE UPLOAD
  const updatedDesc = req.body.description;


  Product.findById(prodId)
    .then(foundProduct => {

      foundProduct.title = updatedTitle;
      foundProduct.description = updatedDesc;
      foundProduct.price = updatedPrice;
      foundProduct.imageUrl = updatedImageUrl;

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
          admin:process.env.ADMIN
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
        fileHelper.deleteFile(foundProduct.imageUrl);
        //delete from database

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

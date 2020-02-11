const fs = require('fs');
const path = require('path');
const stripe = require('stripe')('sk_live_QHYw229i9MryHccb6H7VQBn300GWjAAn91');
const User = require('../models/user');
const Blog = require('../models/blog');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: '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'
  }
}));


const PDFDocument = require('pdfkit');

const Product = require('../models/product');
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
  
  let message = req.flash('addedToCart');
  
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  Product.find() // mongoose method:- gives all products
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        user: req.user || null,
        admin: process.env.ADMIN,
        message: message
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
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index',
        {
          prods: products,
          pageTitle: 'Yummba!',
          path: '/',
          user: req.user || null,
          admin: process.env.ADMIN
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

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
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
};



exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate() // since populate does not return a promise
    .then(user => {
      const products = user.cart.items; //array
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
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
}

exports.postCart = (req, res, next) => {

  const prodId = req.body.productId;
  const quantity = req.body.quantity;

  let message=''

  Product.findById(prodId)
    .then(product => {
      message = `${quantity} ${product.title} added to Cart`
      return req.user.addToCart(product, quantity);

    })
    .then(result => {
      console.log(result);
      req.flash("addedToCart",message);
      res.redirect("/products");
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
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

exports.getCheckout = (req, res, next) => {

  let products;
  let total = 0;

  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {

      products = user.cart.items;
      total = 0;
      products.forEach(p => {
        total += p.quantity * p.productId.price;
      });

      return stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: products.map(p => {
          return {
            name: p.productId.title,
            description: p.productId.description,
            amount: p.productId.price * 100,
            currency: 'inr',
            quantity: p.quantity
          };
        }),
        success_url: req.protocol + '://' + req.get('host') + '/checkout/success',
        cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
      });

    })
    .then(session => {


      res.render('shop/checkoutPayment', {
        path: '/checkout',
        pageTitle: 'Checkout',
        user: req.user || null,
        admin: process.env.ADMIN,
        products: products,
        totalSum: total,
        sessionId: session.id

      })
    })
    .catch(err => {
      console.log("REACHED 3!!");
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });


  //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
  // req.user
  //   .populate('cart.items.productId')
  //   .execPopulate()
  //   .then(user => {
  //     products = user.cart.items;
  //     total = 0;
  //     products.forEach(p => {
  //       total += p.quantity * p.productId.price;
  //     });

  //     res.render('shop/checkout', {
  //       path: '/checkout',
  //       pageTitle: 'Checkout',
  //       products: products,
  //       totalSum: total,
  //       sessionId: session.id,
  //       user: req.user || null,
  //       admin: process.env.ADMIN
  //     });
  //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&


  // return stripe.checkout.sessions.create({
  //   payment_method_types: ['card'],
  //   line_items: products.map(p => {
  //     return {
  //       name: p.productId.title,
  //       description: p.productId.description,
  //       amount: p.productId.price * 100,
  //       currency: 'usd',
  //       quantity: p.quantity
  //     };

  //   }),
  //   success_url: req.protocol + '://' + req.get('host') + '/checkout/success', // => http://localhost:3000
  //   cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
  // });
  // })
  // .then(session => {

  //   console.log(session);
  //   res.render('shop/checkout', {
  //     path: '/checkout',
  //     pageTitle: 'Checkout',
  //     products: products,
  //     totalSum: total,
  //     sessionId: session.id,
  //     user: req.user || null,
  //     admin: process.env.ADMIN
  //   });

  //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&7
  // })
  // .catch(err => {
  //   console.log(err);
  //   const error = new Error(err);
  //   error.httpStatusCode = 500;
  //   return next(error);
  // });
  //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&7

};

exports.getCheckoutSuccess = (req, res, next) => {

  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
          address: req.user.address,
          mobile: req.user.mobile
        },
        products: products
      });
      return order.save();
    })  
    .then(() => {
      transporter.sendMail({
        to:req.user.email,
        from:'yummba@yummba.com',
        subject:'Yummba order placed',
        html:`<h1>Thank you for shopping with us.</h1><p>Your products will be delivered to ${req.user.address}</p><p>For support, please contact</p><p>chandni@yummba.in</p><p>9324621020</p>`
        }); 
    })
    .then(() => {
      transporter.sendMail({
        to:chandni,
        from:'chandni@yummba.in',
        subject:'An order was placed',
        html:`<h1>An order was placed by ${req.user.email}</h1>.<p>Customer mobile : ${req.user.mobile}</p><p>User id: ${req.user}</p><p> To be delivered at ${req.user.address}</p>`
        }); 
    })
    .then(result => {
      return req.user.clearCart();
    })  
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};


exports.getOrders = (req, res, next) => {

  Order.find({ "user.userId": req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
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
};

// exports.getInvoice = (req, res, next) => {

//   const orderId = req.params.orderId;

//   //WE ALREADY CHECK IN GETORDERS, BUT THIS IS A SECONDARY CHECK
//   Order.findById(orderId)
//     .then(order => {
//       if (!order) {
//         return next(new Error('No order found.'));
//       }

//       if (order.user.userId.toString() !== req.user._id.toString()) {
//         return next(new Error("Unauthorized"));
//       }

//       //name of the file
//       const invoiceName = 'invoice-' + orderId + '.pdf';

//       //path which we want to read
//       const invoicePath = path.join('data', 'invoices', invoiceName);

//       //pdfDoc is a readable stream
//       const pdfDoc = new PDFDocument();

//       // this line tells the browser that it is a pdf file.
//       res.setHeader('Content-Type', 'application/pdf');

//       //Displayed in the browser inline and not downloaded and setting the name of the file 
//       //use attachment if you want to download directly
//       res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');

//       //creates a file in the path
//       pdfDoc.pipe(fs.createWriteStream(invoicePath));

//       //call the pipe method to forward the data that is read in with the stream to the response
//       //res object is writeable stream and you can us readable stream to pipe their output to writable streams
//       //node never has to preload the data onto the memory, it will only have to store one chunk at a time//
//       //the browser will concatenate the incoming chunks and create the file
//       pdfDoc.pipe(res);

//       // we put our content here
//       pdfDoc.fontsize(26).text('Invoice'); 

//       pdfDoc.text('-------------------------');

//       let totalPrice = 0;
//       let productTotalPrice =0;
//       order.products.forEach(prod => {
//         productTotalPrice = prod.quantity * prod.product.price;
//         totalPrice += productTotalPrice;
//         pdfDoc.fontsize(12).text(prod.product.title + '-' + prod.quantity + ' X ' + 'Rs' + prod.product.price + '=' + productTotalPrice);

//       });

//       pdfDoc.text('---');
//       pdfDoc.fontsize(14).text("Total Price: Rs" + totalPrice);

//       pdfDoc.end(); // this closes the 2 writeable streams


//     })
//     .catch(err => next(err));
// };



exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then(order => {
      if (!order) {
        return next(new Error('No order found.'));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized'));
      }
      const invoiceName = 'invoice-' + orderId + '.pdf';
      const invoicePath = path.join('data', 'invoices', invoiceName);

      const pdfDoc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'inline; filename="' + invoiceName + '"'
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(26).text('Yummba!', {
        underline: true,
        align: 'center'
      });

      pdfDoc.text('------------------------------------------------------');


      let totalPrice = 0;
      pdfDoc.fontSize(16).text('Order id: ' + orderId);
      pdfDoc.text('------------------------------------------------------');
      pdfDoc.fontSize(16).text("Items purchased");
      pdfDoc.fontSize(16).text("");
      order.products.forEach(prod => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(14)
          .text(
            prod.product.title +
            ' - ' +
            prod.quantity +
            ' x ' +
            'Rs ' +
            prod.product.price
          );
      });
      pdfDoc.fontSize(16).text('------------------------------------------------------');
      pdfDoc.fontSize(20).text('Total Price: Rs ' + totalPrice);
      pdfDoc.fontSize(26).text('------------------------------------------------------');
      pdfDoc.fontSize(16).text("Delivery address");
      pdfDoc.fontSize(16).text(order.user.address);
      pdfDoc.fontSize(26).text('------------------------------------------------------');
      pdfDoc.fontSize(16).text("Contact");
      pdfDoc.fontSize(16).text(order.user.mobile);
      pdfDoc.fontSize(26).text('------------------------------------------------------');
      pdfDoc.fontSize(16).text('We hope you enjoy snacking on Yummbas!', {
        underline: true,
        align: 'center'
      });
      pdfDoc.end();
      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return next(err);
      //   }
      //   res.setHeader('Content-Type', 'application/pdf');
      //   res.setHeader(
      //     'Content-Disposition',
      //     'inline; filename="' + invoiceName + '"'
      //   );
      //   res.send(data);
      // });
      // const file = fs.createReadStream(invoicePath);

      // file.pipe(res);
    })
    .catch(err => next(err));
};



exports.postSubmitAddress = (req, res, next) => {
  const address = req.body.address1 + ',' + req.body.address2 + ',' + req.body.city + ',' + req.body.state + ',' + req.body.pincode;
  const mobile = req.body.mobile;
  console.log("DELIVERY DETAILS");
  console.log(address, mobile, req.user._id);

  User.findById(req.user._id)
    .then(user => {
      user.address = address;
      user.mobile = mobile;

      return user.save()
        .then(result => {
          console.log("UPDATED USER");
          console.log(req.user);
          res.redirect('/checkout');
        });
    })

};

exports.getBlogs = (req, res, next) => {
  Blog.find() // mongoose method:- gives all products
    .then(blogs => {
      res.render('shop/blog-list', {
        blogs: blogs,
        pageTitle: 'Blog',
        path: '/blogs',
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
};
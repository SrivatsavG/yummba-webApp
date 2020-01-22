const fs = require('fs');
const path = require('path');
// const stripe = require('stripe')('sk_test_EL1UmjPYbUwn8hLlEiJpcUYl009oTPWCn0');
const checksum_lib = require('../public/paytm/checksum/checksum');

//('sk_test_EL1UmjPYbUwn8hLlEiJpcUYl009oTPWCn0');

//
const PDFDocument = require('pdfkit');

const Product = require('../models/product');
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
  Product.find() // mongoose method:- gives all products
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
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

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index',
        {
          prods: products,
          pageTitle: 'Shop',
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

  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product, quantity);

    })
    .then(result => {
      console.log(result);
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
  console.log("Reached 0")

  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      console.log("Reached 1");
      products = user.cart.items;
      total = 0;
      products.forEach(p => {
        total += p.quantity * p.productId.price;
      });
      console.log(products);
      console.log(total);
    })
    .then(result => {
      console.log("Reached 2")
      res.render('shop/checkout2', {
        path: '/checkout',
        pageTitle: 'Checkout'
      })

      // res.render('shop/checkout', {
      //   path: '/checkout',
      //   pageTitle: 'Checkout',
      //   products: products,
      //   totalSum: total,
      //   user: req.user || null,
      //   admin: process.env.ADMIN
      // });
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
          userId: req.user
        },
        products: products
      });
      return order.save();
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

      pdfDoc.fontSize(26).text('Invoice', {
        underline: true
      });
      pdfDoc.text('-----------------------');
      let totalPrice = 0;
      order.products.forEach(prod => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(14)
          .text(
            prod.product.title +
            ' - ' +
            prod.quantity +
            ' x ' +
            '$' +
            prod.product.price
          );
      });
      pdfDoc.text('---');
      pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);

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



exports.postPayment = (req, res, next) => {
  try {
    let params = {}
    params['MID'] = 'WopolV35383146897967',
      params['WEBSITE'] = 'WEBSTAGING',
      params['CHANNEL_ID'] = 'WEB',
      params['INDUSTRY_TYPE_ID'] = 'Retail',
      params['ORDER_ID'] = 'ORD0001',
      params['CUST_ID'] = 'CUST0001',
      params['TXN_AMOUNT'] = '100',
      params['CALLBACK_URL'] = 'https://yummba.herokuapp.com/products',
      params['EMAIL'] = 'xyz@gmail.com',

      checksum_lib.genchecksum(params, 'LKVKUJIKc&Zg#ZAc', function (err, checksum) {
        let txn_url = "https://securegw-stage.paytm.in/order/process"

        let form_fields = ""
        for (x in params) {
          form_fields += "<input type='hidden' name='" + x + "' value='" + params[x] + "'/>"
        }

        form_fields += "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' />"

        var html = '<html><body><center><h1>Please wait! Do not refresh the page</h1></center><form method="post" action="' + txn_url + '" name="f1">' + form_fields + '</form><script type="text/javascript">document.f1.submit()</script></body></html>'
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.write(html)
        res.end()
      })
  }
  catch{
    console.log("ERROR IN POSTPAYMENT");
    res.redirect("/products");
  }
}

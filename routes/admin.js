const path = require('path');

const express = require('express');

const {body} = require('express-validator/check')

const adminController = require('../controllers/admin');

const isAuth = require('../middleware/is-auth');


const router = express.Router();

// // /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/add-product => POST
router.post('/add-product',isAuth, adminController.postAddProduct);

// // /admin/products => GET
router.get('/products', isAuth,adminController.getProducts);

router.get('/edit-product/:productId',isAuth, adminController.getEditProduct);

router.post('/edit-product',isAuth, adminController.postEditProduct);

router.delete('/product/:productId', isAuth,adminController.deleteProductAndFromUserCart);

router.get('/add-blog', isAuth,adminController.getAddBlog);

router.post('/add-blog', isAuth,adminController.postAddBlog);

router.delete('/blogs/:blogId', isAuth,adminController.deleteBlog);

router.get('/write-blog', isAuth,adminController.getWriteBlog);

router.post('/write-blog', isAuth,adminController.postWriteBlog);


module.exports = router;

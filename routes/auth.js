const express = require('express');

//WE IMPORT A SUBPACKAGE called check. We use destructuring and pull out check. 
//check checks header,body, cookies, params etc.
//check function is used as a middleware
//body on the other hand checks only the body
const { check, body } = require('express-validator/check');
const User = require('../models/user');

const authController = require('../controllers/auth');

const router = express.Router();


//===============================LOGIN======================
router.get('/login', authController.getLogin);

router.post('/login',
    check('email').isEmail().withMessage("Enter a valid email address")
        .normalizeEmail(),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be atleast 8 characters long')
        .trim(),
    authController.postLogin
);


//==============================SIGNUP============================

router.get('/signup', authController.getSignup);



router.post(
    '/signup',

    //checks for email everywhere
    check('email')
        .isEmail().withMessage('Please a enter a valid email')

        //Custom to check if email already exists. Asynchronous validation
        .custom((value, { req }) => {
            return User.findOne({ email: value })
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject(
                            'Email already exists, please use another email or try logging in'
                        );
                    }
                });
        })
        .normalizeEmail(),

    //checks if password is atleast 5 and is only alphanumeric and sets a common error message for all conditions
    body('password', 'Please enter a password that is atleast 8 characters long')
        .isLength({ min: 8 })
        .trim(),

    //checks for confirm password. Destructure req.
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords have to match');
            }
            return true;
        })
        .trim(),
    authController.postSignup
);

//==============================LOGOUT============================


router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
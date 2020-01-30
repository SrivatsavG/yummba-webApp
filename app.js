const path = require('path');
const fs = require('fs');
const https = require('https');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require('connect-mongodb-session')(session);//session is passed to the function that is returned by connect-mongodb-session
const csurf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const helmet = require('helmet');
const compression=require('compression');
const morgan = require('morgan');

const errorController = require('./controllers/error');
const User = require("./models/user");

//

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-ejo76.mongodb.net/${process.env.MONGO_DB}`;

const app = express();
const store = new MongoDBStore({// is a constructor
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csurf();

const fileStorage = multer.diskStorage({
  //tells where to store, null says multer that there is no error
  //// dest:images=>turns buffer into binary and stores it at images folder that it creates on the fly
  //if we dont use dest, it stores it directly in memory and we cant use it.
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  //sets the filename,null says that there is no error
  filename: (req, file, callback) => {
    callback(null, new Date().toISOString() + '-' + file.originalname);// to ensure we dont have to two files with the same name
  }
});

const fileFilter = (req, file, callback) => {
  //call this callback with true if you want to accept the file, false if you dont want to accept
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

app.set('view engine', 'ejs');
app.set('views', 'views');


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'), {flags:'a'});

app.use(helmet());
app.use(compression());
app.use(morgan('combined',{stream:accessLogStream}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));// single as we expect only one file, 
//image because we used that name in the view

app.use(express.static(path.join(__dirname, 'public')));
//we say, if we have a request that starts with /images , then serve the files in "images" folder statically. 
//Or else it looks for images in the root folder and not in the images folder
app.use('/images',express.static(path.join(__dirname,'images')));

app.use(
  session({
    secret: 'my secret', //used for hashing
    resave: false, // session will not be saved on every req or res,
    saveUninitialized: false,
    store: store
  })
);

app.use(csrfProtection);
app.use(flash());

//reads file synchronously, the code will only move forward after this is done
// const privateKey = fs.readFileSync('server.key');
// const certificate = fs.readFileSync('server.cert');

//SETS FOR EVERY USER AND FOR EVERY REQUEST
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});


// TO USE THE METHODS OF THE USER MODEL ( req.user only stores the data)

app.use((req, user, next) => {

  if(req.session.isLoggedIn){
    console.log("ISLOGGED IN")
  }
  else {
    console.log("NOT ISLOGGED IN")

  }

  //IF NO USER HAS SIGNED IN , MOVE ON
  if (!req.session.user) {
    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
    console.log("NOBODY HAS SIGNED IN");
    return next();
  } 

  //IF USER HAS SIGNED IN 
  User.findById(req.session.user._id)
    // The then block is reached whether we find the user inthe database or not. 
    //So we need error handling to handle the case where the user is not found
    .then(user => {
      if (!user) { //User not found
        console.log("USER NOT FOUND")
        return next()
      }
      req.user = user;
      console.log("USER IS" + user);
      console.log("REQ.USER is" + req.user);
      next();
    })
    //THIS FIRES when there is a technical issue with findById
    .catch(err => {
      next(new Error(err));
    });
});


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

//NORMALLY THIS MIDDLEWARE WOULDNT BE REACHED BECAUSE WE HAVE app.use ABOVE THIS.
//BUT THIS IS SPECIAL

app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).render('500', {
    pageTitle: 'Error',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn,
    user: req.user || null,
    admin : process.env.ADMIN
  });
});

console.log("reached here");
mongoose
  .connect(MONGODB_URI)
  .then(result => {
    console.log("==============SERVER HAS STARTED===========");
    app.listen(process.env.PORT || 3000);
  })
  .catch(err => {
    console.log("==============MONGOOSE ERROR=============");
    console.log(err);
  });


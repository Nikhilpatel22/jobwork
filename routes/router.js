const express = require("express");
const router = express.Router();
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');
const Student = require("../models/student");
const user = require('../models/user');
const department = require("../models/department");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require("passport");
const bcrypt = require('bcrypt');
const fs = require('fs');
const { Store } = require("express-session");
const flash = require('connect-flash');
const studentController = require('../controller/student');
const passportAuthentication = require('../middleware/passportAuthentication');
const googleAuth = require('../middleware/googleAuth');
const jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
//require('./passportLocal')(passport);
//require('./googleAuth')(passport);

//const jwt = require('jsonwebtoken');
//const authentication = require('../middleware/authentication')

router.use(express.static(__dirname + "./public/"))
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


router.use(cookieParser('secret'));
router.use(session({
    secret: 'secret',
    maxAge: 3600000,
    resave: true,
    saveUninitialized: true
}))

router.use(passport.initialize());
router.use(passport.session());

router.use(flash());

//flash
router.use(function (req, res, next) {
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error');
    next();
})

//use multer
var storage = multer.diskStorage({
    destination: './public/file/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({
    storage: storage
}).single('file');

//checkauthnetication 
const checkAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.set('cache-control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0')
        return next();
    } else {
        res.redirect('/login')
    }
}

//get index page
router.get('/', (req, res) => {
    res.render('index');
})

//get register    
router.get('/register', studentController.getRegister);

//post register
router.post('/register', upload, studentController.postRegister);


//get login
router.get('/login', studentController.getLogin);

//post login
router.post('/login', studentController.postLogin);

//get home page
router.get('/home', checkAuthenticated, studentController.getHome);

//get delete user
router.get('/delete/:id', studentController.getDelete);

//get edit user
router.get('/edit/:id', studentController.getEdit);

//post update user
router.post('/update/', upload, studentController.postUpdate)

//post department user
router.post('/department', studentController.postDepartment);

//get logout
router.get('/logout', studentController.getLogout);


router.get('/department', studentController.getDepartment);
router.post('/department', studentController.postDepartment);

//get send mail
router.get('/sendmail',(req,res)=>{
    res.render('sendmail');
})
router.get('/mail',(req,res)=>{
    res.render('mail');
})

//post post mail
router.post('/sendmail',(req,res)=>{
    upload(req,res,function(err){
        if(err){
            console.log(err)
            return res.end("Something went wrong!");
        }else{
            var {to,subject,body,path} = req.body;
            
            to = to
            subject = subject
            body = body
            path = req.file.path
            console.log(to);
            console.log(subject);
            console.log(body);
            console.log(req.file);

            var sendmail = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'pnik2228@gmail.com',
                  pass: ''
                }
              });
              
              var mailOptions = {
                from: 'pnik2228@gmail.com',
                to: to,
                subject: subject,
                text: body,
                attachments: [
                    {
                     path: path
                    }
                 ]
              };
              sendmail.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                  fs.unlink(path,function(err){
                    if(err){
                        return res.end(err)
                    }else{
                        console.log("deleted")
                        return res.redirect('/mail')
                    }
                  })
                }
              });
        }
})
})

// let user = {
//      id : "7eghwufyguwfujfvg",
//      email : "nikhil@gmail.com",
//      password : "nfwebfkwfkwe;'nknknkfvnkfnkenfvk"
// }

const JWT_SECRET = 'some super secret...'

//get forget password
router.get('/forgetpwd/',(req,res)=>{
    res.render('forgetpwd');
})
 
//post forget password
router.post('/forgetpwd/', async (req,res,next)=>{
    const { email } = req.body;
    
var user = await Student.findOne({email: email});
    if(email !== user.email){
        res.send('user not register');
        return ;
    }

    const secret = JWT_SECRET + user.password;
    const payload = {
         email : user.email,
         id : user.id
    }
    const token = jwt.sign(payload, secret,{expiresIn:'15m'})
    const link = `http://localhost:3000/resetpwd/${user._id}/${token}`;
    console.log(link);
    var sendmail = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: '',
          pass: ''
        }
      });
      
      var mailOptions = {
        from: '',
        to: 'nikhilpatel.vision@gmail.com',
        subject: 'forget password',
        text: link,
      };
      sendmail.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          fs.unlink(path,function(err){
            if(err){
                return res.end(err)
            }else{
                console.log("deleted")
                return res.send('password reset liink has been sent to ur emamil');
            }
          })
        }
      });
})


//get reset password
router.get('/resetpwd/:id/:token',async(req,res)=>{
    const {id,token} = req.params;
    var user = await Student.findById(id);
    if(id !== user.id){
        res.send('invalida id')
        return;
    }
    const secret = JWT_SECRET + user.password;
    try{
        const payload = jwt.verify(token,secret);
        res.render('resetpwd',{email : user.email})
    }catch(error){
console.log(error.message);
res.send(error.message);
    }
})

//post reset password
router.post('/resetpwd/:id/:token',async(req,res)=>{
    const {id ,token} =req.params;
    const {password,cpassword} = req.body;
    var user = await Student.findById(id);
    if(id !== user.id){
        res.send('invalida id')
        return;
    }
    const secret = JWT_SECRET + user.password;
    try{
        const payload = jwt.verify(token,secret);
        user.password = password;
        res.send(user);
        user.save();
    }catch(error){
console.log(error.message);
res.send(error.message);
    }
})


//google authenticaion login
// router.get('/glogin',(req,res)=>{
//     res.render('glogin');
// })
// router.post('/glogin', (req, res, next) => {
//     passport.authenticate('local', {
//         failureRedirect: '/glogin',
//         successRedirect: '/profile',
//         failureFlash: true,
//     })(req, res, next);
// });

//google authentication

 router.get('/google', passport.authenticate('google', { scope : ['email', 'profile',] }));

 router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
     res.redirect('/home');
 });

//  router.get('/profile',checkAuthenticated, (req, res) => {
//     // adding a new parameter for checking verification
//     res.render('profile', { username: req.user.username, verified : req.user.isVerified });

//  });


module.exports = router;
const Student = require("../models/student");
const department = require("../models/department");
const bcrypt = require('bcrypt');
const passport = require("passport");
const request = require('request');


//get home page
exports.getHome = (req, res, next)=>{
    Student.aggregate([ 
        { $lookup :
          {
            from: 'departments',
            localField: 'department',
            foreignField: '_id',
            as: 'students'
          },
        },
        {
            $unwind: "$students",
          },
        ]).exec(function (err, data) {
        console.log(data);
            if (err) throw err;
        res.render('home', { title: 'student data', records: data });
    })
}

// //get home page
// exports.getHome = (req, res) => {
//     Student.find({}).exec(function (err, data) {
//         if (err) throw err;
//         res.render('home', { title: 'student data', records: data });
//     })
// }


//get register
exports.getRegister = (req, res) => {
    department.find({}).exec(function (err, data) {
        if (err) throw err;
        res.render('register', { title: 'student data',records : data});
    })
}

//post register
exports.postRegister = function (req, res, next) {
    var { name, email,phone, password,cpassword, gender, hobbies } = req.body;
    var err;
    
    if (!name || !email || !phone || !password || ! cpassword || !gender || !hobbies) {
        err = 'plz fill all the fields'
        res.render('register', { err: err });
    }
    if(!(/^[\-0-9a-zA-Z\.\+_]+@[\-0-9a-zA-Z\.\+_]+\.[a-zA-Z]{2,}$/).test(String(email))){
        err = 'plz fill valid email'
        res.render('register',{ err : err});
    }
    if(!(/^(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{6,16}$/).test(String(password))){
        err = 'plz fill valid password'
        res.render('register',{ err : err});
    }
    if(password != cpassword){
        err = 'passworrd dont match'
        res.render('register',{err : err})
    }
    if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null)
    {
      return res.json({"responseError" : "Please select captcha first"});
    }
    const secretKey = "6LcEYNkcAAAAALYar2miP6rfQhVh3t7MmICIlPH4";
  
    const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
  
    request(verificationURL,function(error,response,body) {
      body = JSON.parse(body);
  
      if(body.success !== undefined && !body.success) {
        return res.json({"responseError" : "Failed captcha verification"});
      }
      res.json({"responseSuccess" : "Sucess"});
    })    
    if (typeof err == 'undefined') {
        Student.findOne({ email: email }, function (err, data) {
            if (err) throw err;
            if (data) {
                console.log('user exist');
                err = "user already exist this email..."
                res.render('register', { err: err });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    const student = new Student({
                        name: req.body.name,
                        email: req.body.email,
                        phone: req.body.phone,
                        password: hash,
                        gender: req.body.gender,
                        hobbies: req.body.hobbies,
                        department : req.body.department,
                        file: req.file.filename,
                    })
                    student.save(function (err, req1) {
                        if (err) throw err;
                        Student.find({}).exec(function (err, data) {
                            if (err) throw err;
                            req.flash('success_message', 'registration successfully.....');
                            res.redirect('/home');
                        })
                    })
                })
            }
        })
    }
}
//get department detail
exports.getDepartment = function (req, res, next) {
    Department.find({}).exec(function (err, data) {
        if (err) throw err;
        res.render('register', { title: 'student data',records : data});
    })
}

//post department details
exports.postDepartment = function(req,res,next){
     const department = new Department({
         name : req.body.name,
     })
     department.save(function (err, req1){
         if (err) throw err;
                         Department.find({}).exec(function (err, data) {
                             if (err) throw err;
                             res.redirect('/home');
                         })

    })
 }

//get login routes

exports.getLogin = function (req, res, next) {
    Student.find({}).exec(function (err, data) {
        if (err) throw err;
        res.render('login', { title: 'login', records: data });
    })
}

//post login routes

exports.postLogin = (req, res, next) => {
    passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/home',
        failureFlash: true,
    })(req, res, next);
};

//get edit routes
exports.getEdit = function (req, res, next) {
    var id = req.params.id;
    var edit = Student.findById(id);
    edit.exec(function (err, data) {
        if (err) throw err;
        res.render('edit', { title: 'student updated data', records: data });
    })
}

//post edit routes
exports.postUpdate = function (req, res, next) {
    if (req.file) {
        var datarecords = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            gender: req.body.gender,
            hobbies: req.body.hobbies,
            file: req.file.filename,
        }
    } else {
        var datarecords = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            gender: req.body.gender,
            hobbies: req.body.hobbies,
        }
    }
    var id = req.body.id;
    var update = Student.findByIdAndUpdate(id, datarecords)
    update.exec(function (err, data) {
        if (err) throw err;
        res.redirect('/home');
    })
}

//get Delete
exports.getDelete = function (req, res, next) {
    var id = req.params.id;
    var del = Student.findByIdAndDelete(id);
    del.exec(function (err) {
        if (err) throw err;
        res.redirect('/home');
    })
}

//get logout
exports.getLogout = function (req, res, next) {
    req.logout();
    res.redirect('/login');
}
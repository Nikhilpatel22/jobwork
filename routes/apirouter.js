const express = require("express");
const router = express.Router();
const Student = require("../models/student");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const authentication = require('../middleware/authentication')

router.use(express.static(__dirname + "./public/"))

router.get('/',(req,res,next)=>{
    Student.find()
    .exec()
    .then((result)=>{
        res.status(200).json({
            StudentData:result
        });
    })
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
})


router.post('/signup',upload.single('file'),(req,res,next)=>{
    console.log(req.body);
    bcrypt.hash(req.body.password,10,(err,hash)=>{
        if(err)
        {
            return res.status(500).json({
                error:err
            });
        }
        else
        {
            const student = new Student({
                name : req.body.name,
                email : req.body.email,
                phone : req.body.phone,
                password : hash,
                gender : req.body.gender,
                hobbies : req.body.hobbies,
                file: req.file.filename,
            })
            student.save()
            .then((result)=>{
                res.status(200).json({
                    StudentData:result
                })
            })
            .catch((err)=>{
                res.status(500).json({
                    error:err
                });
            })
        }
    })
})
router.post('/sigin',(req,res,next)=>{
    Student.find({email:req.body.email})
    .exec()
    .then(user=>{
        if(user.length < 1){
            return res.status(500).json({
                messege:'user not exist'
        })
        }
        bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
            if(!result){
                return res.status(500).json({
                    messege:'password not match'
            })
        }
        if(result){
            const token = jwt.sign({
                name:user[0].name,
                email:user[0].email,
                phone:user[0].phone,
                gender:user[0].gender,
                hobbies:user[0].hobbies
            },
            'this is dummy text',
            {
                expiresIn:"24h"
            })
            res.status(200).json({
                name:user[0].name,
                email:user[0].email,
                phone:user[0].phone,
                gender:user[0].gender,
                hobbies:user[0].hobbies,
                token:token
            })
        }
    })
})
.catch((err)=>{
        res.status(500).json({
            error:err
        })
    })    
})

module.exports = router;
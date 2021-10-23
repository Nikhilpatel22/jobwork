const express = require("express");
const app = express();
const http = require('http');
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const Student = require("./models/student");
const fuser = require("./models/fuser")
const bcrypt = require('bcrypt');
const multer = require('multer');
const swaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
require('./database/conn')
app.use(express.json());

const swaggerOptions={
    definition:{
        openapi:'3.0.0',
        info:{
            title:'Student Management API',
            version:'1.0.0',
            description:'Student Api for student management',
            servers:["http://localhost:3000"]
        }
    },
    apis:["swagger.js"]
}
const swaggerDocs=swaggerJSDoc(swaggerOptions);
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocs));

app.use(express.json());

 /**
 * @swagger
 * /student:
 *  get:
 *   summary: get all student
 *   description: get all students
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description: error
 */
app.get('/student',(req,res)=>{
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

/**
  * @swagger
  * /signup:
  *  post:
  *   summary: create student
  *   description: create students for the organisation
  *   responses:
  *    200:
  *     description: student created succesfully
  *    500:
  *     description: failure in creating employee
  */
app.post('/signup',(req,res,next)=>{
    const student = new Student(req.body);

    student.save(function (err) {
      if (err) {
        next(err);
      } else {
        res.json(student);
      }
    });
        })
   
/**
  * @swagger
  * /getid/:id:
  *  get:
  *   summary: get id with student
  *   description: get student
  *   responses:
  *    200:
  *     description: student created succesfully
  *    500:
  *     description: failure in creating employee
  */     
 app.get('/getid/:id',(req,res,next)=>{
    Student.find()
    .exec()
    .then((result)=>{
        res.status(200).json({
            StudentData:result
        });
    })
})

/**
  * @swagger
  * /delete/:id:
  *  get:
  *   summary: delete student
  *   description: delete student
  *   responses:
  *    200:
  *     description: student delete succesfully
  *    500:
  *     description: failure in delete student
  */  
app.get('/delete/:id',(req,res)=>{
	fuser.deleteOne({_id:req.params.id})
	.then(result=>{
	res.status(200).json({
		message:'record delete',
		result:result
	})	
	})
	.catch(err=>{
		res.status(500).json({
			error:err
		})
	})
})
server.listen(port,(console.log(`server running in port number ${port}`)));
module.exports = app;

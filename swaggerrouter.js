const express = require("express");
const router = express.Router();
const Student = require("../models/student");
const swaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
router.use(express.json());

const swaggerOptions={
    definition:{
        openapi:'3.0.0',
        info:{
            title:'Employee Management API',
            version:'1.0.0',
            description:'Employe Api for employee management',
            servers:["http://localhost:3000"]
        }
    },
    apis:["../routes/swaggerrouter.js"]
}
const swaggerDocs=swaggerJSDoc(swaggerOptions);
router.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocs));

/**
 * @swagger
 * /:
 * get:
 *     summary : this api use to check if get  method is working or not
 *     discription : this api use to check if get  method is working or not
 *      responses : 
 *              200:
 *                  description : to test get method
 */

router.get('/',(req,res)=>{
    res.send('welcome to mongodb api')
})
module.exports = router;

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/practical',{
     useNewUrlParser : true,
     useUnifiedTopology : true
 }).then(()=>{
     console.log("connection successfully");
 })
 .catch((error)=>{
     console.log(error)
 })
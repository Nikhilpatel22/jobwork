const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const studentSchema = new Schema({
    name : {
        type : String
    },
    email : {
        type : String
    },
    phone : {
        type : String
    },
    password : {
        type : String
    },
    gender : {
        type : String
    },
    hobbies : {
        type : Array
    },
    department : {
        type : Schema.Types.ObjectId,
        ref: "department"
    },
    file : {
        type : String
    },
});



module.exports = mongoose.model('Student',studentSchema);

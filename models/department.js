const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const departmentSchema = new Schema({
    name : {
        type :  Schema.Types.ObjectId,
        ref: "Student"
    },
});

module.exports = mongoose.model('department',departmentSchema);
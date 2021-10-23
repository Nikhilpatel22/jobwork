const fs = require('fs');
const pdf = require('pdf-creator-node');
const path = require('path');
const options = require('../helpers/options');
const data = require('../helpers/data1');
const Student = require('../models/student');
//const data = require('../helpers/data');


exports.homeview = (req, res, next) => {
    res.render('pdfhomepage');
}

exports.generatePdf = async (req, res, next) => {
        const html = fs.readFileSync(path.join(__dirname, '../view/tamplate.html'), 'utf-8');
        var newValue = html.replace(/data16/gim, 'data17');
        fs.writeFileSync(path.join(__dirname, '../view/tamplate.html'), newValue, 'utf-8');

        const filename = Math.random() + '_doc' + '.pdf';
        
        let array = [];

        var user = await Student.find({});
        console.log(user);

        user.forEach(u=>{
            const data = {
                name : u.name,
                email : u.email,
                phone : u.phone
            }
            array.push(data);
        })

        const obj = {
            userlist : array
        }
        const document = {
            html: html,
            data: {
                users : obj
            },
            path: './docs/' + filename
        }
        pdf.create(document, options)
            .then(res => {
                console.log(res);
            }).catch(error => {
                console.log(error);
            });
            const filepath = 'http://localhost:3000/docs/' + filename;

            res.render('download', {
                path: filepath
            });
}



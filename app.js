const express = require('express');
const path = require('path');
const app = express();
const router = require('./routes/router')
const apirouter = require('./routes/apirouter')
const bodyParser = require('body-parser');
require('./database/conn')

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'view'));

app.use(express.static(path.join(__dirname,'public')));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/',router);
app.get('/register',router);
app.post('/register',router);
app.get('/login',router);
app.post('/login',router);
app.get('/home',router);
app.get('/delete/:id',router);
app.get('/edit/:id',router);
app.post('/update/',router);
app.get('/logout',router);
app.post('/search/',router);
app.post('/department',router);
app.get('/department', router);
app.get('/sendmail', router);
app.post('/sendmail', router);
app.get('/mail', router);
app.get('/forgetpwd', router);
app.post('/forgetpwd', router);
app.get('/resetpwd/:_id/:token', router);
app.post('/resetpwd/:_id/:token', router);

app.use('/student',apirouter)
module.exports = app;
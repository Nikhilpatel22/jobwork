const express = require('express');
const path = require('path');
const app = express();
const router = require('./routes/router')

const apirouter = require('./routes/apirouter')
const swaggerrouter = require('./routes/swaggerrouter')

const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
require('./database/conn')

app.use(expressLayouts);
app.set('view engine','ejs');
//app.set('view engine', '.hbs');
app.set('views',path.join(__dirname,'view'));

app.use(express.static(path.join(__dirname,'public')));
router.use(express.static(path.resolve(__dirname,'public')));
app.use('/docs', express.static(path.join(__dirname, 'docs')));

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

app.get('/test', router);


app.post('/glogin', router);
app.get('/glogin', router);
app.get('/profile', router);

app.get('/google', router);
app.get('/google/callback',router);

app.get('/auth/instagram',router);
app.get('/auth/instagram/callback',router); 

app.get('/auth/facebook',router);

app.get('/facebook', router);
app.get('/auth/facebook/callback',router);

app.get('/auth/linkedin',router);
app.get('/auth/linkedin/callback',router);
  

app.post('/forgetpwd', router);
app.get('/forgetpwd', router);
app.get('/resetpwd/:_id/:token', router);
app.post('/resetpwd/:_id/:token', router);

app.get('/homeview', router);
app.get('/download', router);

app.get('/excel', router);
app.get('/excelhome', router);
app.post('/excel', router);
app.post('/exportdata', router);

app.use('/swagger',swaggerrouter)
app.get('/',swaggerrouter)

app.use('/student',apirouter)
module.exports = app;
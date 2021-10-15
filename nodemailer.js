var nodemailer = require('nodemailer');

var sendmail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'pnik2228@gmail.com',
    pass: 'nikhil@222831'
  }
});

var mailOptions = {
  from: 'pnik2228@gmail.com',
  to: 'patel221211@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

sendmail.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
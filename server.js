// call the packages we need
const express = require('express');  // call express
const mailer = require('@sendgrid/mail'); 
const pug = require('pug')
const app = express(); // create a server
// const user = {
//   name: "mic",
//   message: "testmessage"
// }

mailer.setApiKey('yourSendGridKey');

const port = process.env.PORT || 8000;  // set our port

// set the view folder to views
app.set('views', __dirname + '/views');
// set the view engine to pug
app.set('view engine', 'pug');


app.get('/', function (req, res) {
       sendEmail({
            toAddress: 'arjunphp@gmail.com',
            subject: 'Email from SMTP sever',
            data: {  // data to view template, you can access as - user.name
              user: {
                name: 'Arjun PHP',
                message: 'Welcome to arjunphp.com'
              }
            },
            htmlPath: "welcome.pug"
        }).then(() => {
          return res.send('Email has been sent!');
        }).catch((error) => {
          return res.send('There was an error sending the email');
        })
});

const sendEmail = function(mailOptionsObject) {
 
    const html = pug.renderFile(
      __dirname + "/views/email/" + mailOptionsObject.htmlPath,
      mailOptionsObject.data
    );

    const msg = {
      to: mailOptionsObject.toAddress,
      from: config.get('emailFrom'),
      subject: mailOptionsObject.subject,
      html: html
    };

    const status = sgMail.send(msg)
    return status;
  
};

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});
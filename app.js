if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
  require("dotenv").config({ path: ".env" });
}

const sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const path = require("path");
const cors = require("cors");

const request = sg.emptyRequest({
  method: 'POST',
  path: '/v3/mail/send',
  body: {
    personalizations: [
      {
        to: [
          {
            email: process.env.EMAIL_TO,
          },
        ],
        subject: 'Hello World from the SendGrid Node.js Library!',
      },
    ],
    from: {
      email: process.env.EMAIL_FROM,
    },
    content: [
      {
        type: 'text/html',
        value: '<b><i>Html Email2!</b></i>',
      },
    ],
  },
});

const getsgreq = json => ({
  method: 'POST',
  path: '/v3/mail/send',
  body: {
    personalizations: [
      {
        to: [
          {
            email: process.env.EMAIL_TO,
          },
        ],
        subject: 'JSON Hook!',
      },
    ],
    from: {
      email: process.env.EMAIL_FROM,
    },
    content: [
      {
        type: 'text/html',
        value: JSON.stringify(json),
      },
    ],
  },
});

const sendg = json => {
  const sgreq = getsgreq(json)
  const request = sg.emptyRequest(sgreq)
  sg.API(request)
  .then(response => {
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
  })
  .catch(error => {
    //error is an instance of SendGridError
    //The full response is attached to error.response
    console.log(error.response.statusCode);
  });
}

app.use(cors("*"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use((req, res, next) => {
  console.log('Request type: ', req.method);
  next();
});

app.use(function (req, res) {
  sendg(req.body)
  res.setHeader('Content-Type', 'text/plain')
  res.write('you posted and sent by mail:\n')
  res.end(JSON.stringify(req.body, null, 2))
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server listening on PORT ${port}`)
});

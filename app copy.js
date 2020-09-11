if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
  require("dotenv").config({ path: ".env" });
}

const sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

const express = require('express');
const {end, reqobj, requestTime} = require('./middleware')()
const bodyParser = require('body-parser')
const path = require("path");
const cors = require("cors");
const app = express();

const getsgreq = json => ({ // get sendgrid request with json-content
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

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use('/info', [requestTime, reqobj])
  // app.use(requestTime)

app.use(end)
  // app.use(reqobj)
// app.use((req, res, next) => res.end())

app.use('/mail', (req, res) => {
  console.log('mail: ', req.method);
  sendg(req.body)
});
app.use('/', (req, res, next) => {
  console.log('Request type: ', req.method);
  console.log('Request time: ', req.requestTime);
  next();
});
app.use('/test', (req, res, next) => {
  res.end("req.body: " + JSON.stringify(req.body, null, 2))
});
app.use('/mail', (req, res) => {
  console.log('mail: ', req.method);
  sendg(req.body)
  res.setHeader('Content-Type', 'text/plain')
  res.write('you posted and sent by mail:\n')
  res.end("req.body: " + JSON.stringify(req.body, null, 2))
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server listening on PORT ${port}`)
});

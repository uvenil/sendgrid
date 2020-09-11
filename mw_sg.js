if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
  require("dotenv").config({ path: ".env" });
}

const sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
const {reqobj, requestTime} = require('./middleware')()

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
    console.log("mail status code: ", response.statusCode);
    console.log("body: ", response.body);
    console.log("headers: ", response.headers);
  })
  .catch(error => {
    //error is an instance of SendGridError
    //The full response is attached to error.response
    console.log(error.response.statusCode);
  });
}

const sgmw =  (req, res, next) => sendg(req.body)  // send email with body

module.exports = sgmw

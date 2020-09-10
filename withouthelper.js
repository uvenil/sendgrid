if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
  require("dotenv").config({ path: ".env" });
}
var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
var request = sg.emptyRequest({
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

//With promise
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
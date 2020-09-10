// https://devcenter.heroku.com/articles/sendgrid#node-js
var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
var request = sg.emptyRequest({
  method: 'POST',
  path: '/v3/mail/send',
  body: {
    personalizations: [
      {
        to: [
          {
            email: 'test@example.com',
          },
        ],
        subject: 'Hello World from the SendGrid Node.js Library!',
      },
    ],
    from: {
      email: 'test@example.com',
    },
    content: [
      {
        type: 'text/plain',
        value: 'Hello, Email!',
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

//With callback
sg.API(request, function(error, response) {
  if (error) {
    console.log('Error response received');
  }
  console.log(response.statusCode);
  console.log(response.body);
  console.log(response.headers);
});
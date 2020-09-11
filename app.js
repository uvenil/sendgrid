if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
  require("dotenv").config({ path: ".env" });
}

const express = require('express');
// const {answer, end, reqobj, requestTime} = require('./alt/middleware01')()
const {answer, end, reqobj, requestTime} = require('./middleware')()
const sgmw = require('./mw_sg')
const bodyParser = require('body-parser')
const cors = require("cors");
const app = express();


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded
app.use(bodyParser.json())  // parse application/json

app.use('/info', [requestTime, reqobj])
// app.use('/mail', sgmw);
app.use('/mail', [requestTime, reqobj, answer]);
app.use(end);


const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server listening on PORT ${port}`)
});

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
// require('dotenv').config({ path: `.env.${process.env.ENV}` })
const app = express();

const port = 7800;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/dist')));

const router = require('./server/routes/mainRouter');

app.use('/api/', router);

// Error Handler Middleware
router.use( (err,req,res,next) => {
  console.log(err);
  return res.status(500).json({message:err.message, stackTrace: err.stack})
} )

app.route('/ping').get( (req,res) => res.status(200).json({"response": "Everything is ok from app"}) )

app.listen(port, () => {
  console.log(`Running on port ${port}.`);
});

const express = require('express');
const mongoose = require('mongoose');
const mainController = require('../controllers/mainController')();
const classRouter = require('./classRouter')

const mainRouter = express.Router();

let expFactor = 1;
let DB_CONNECTION_STRING = 'mongodb+srv://Abhi:Abhi%40219@cluster0.n9mw0.mongodb.net/kutuki?authSource=admin&replicaSet=atlas-11wkco-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true'

/**
 * 
 * Function to connecte to db. Uses exponential timing to connect until one hr, timing will reset after request
 */
function connectToDb(res){
  const db = mongoose.connect( DB_CONNECTION_STRING,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
    }
  );

  db
  .then( (data)=>{
    if(mongoose.connection.readyState === 1){
      console.log(`Connected to database`);
    }
  })
  .catch((err) => {
    console.log("Db Connection Error, trying to reconnect... " + mongoose.connection.readyState );
    if(expFactor<3600){
      expFactor = expFactor*2
    }else {
      expFactor = 1;
    }
    
    if(res){
      expFactor === 1 ? setTimeout( connectToDb, expFactor * 1000 ) : expFactor = 1;
      return res.status(500).json(err);
    }else{
      setTimeout( connectToDb, expFactor * 1000 );
      // console.error(err);
    }
   
  });;
};

( async function(){
  await connectToDb();
} )();


mongoose.connection.on('close', () => {console.log("Connection Closed")});

mainRouter.use('/class', classRouter)
mainRouter.use('/reserveSeat', mainController.reserveSeat);
mainRouter.use('/confirmReservation', mainController.confirmReservation);
mainRouter.use('/cancelReservation', mainController.cancelReservation);
mainRouter.use('/generateReport', mainController.report);

module.exports = mainRouter;
const mongoose = require('mongoose');
mongoose.pluralize(null);
const  { nameValidator, classStatusValidator, getDateinIST } =  require('../utilities/utils');
const {Schema} = mongoose;

const classSchema = new Schema({
  name: {type:String, required:true, validate: nameValidator},
  classType: {type:mongoose.ObjectId, required:true},
  totalSessions: {type:Number, min: 0, required: true},
  numberOfSeats: {type:Number, min: 0, required: true},
  startTime: {type:Date, required: true },
  blockedSeats:  {type:Number, min: 0, default:0},
  seatsBooked: {type:Number, min: 0, default:0},
  status: {type:String, validate: classStatusValidator, default:"UPCOMING"}
},{versionKey:false});

module.exports = mongoose.model('class', classSchema);
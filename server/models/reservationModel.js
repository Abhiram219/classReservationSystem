const mongoose = require('mongoose');
mongoose.pluralize(null);
const {getDateinIST} = require('../utilities/utils')
const {Schema} = mongoose;

const classTypeSchema = new Schema({
  userId : {type:mongoose.ObjectId, required:true},
  classId : {type:mongoose.ObjectId, required:true},
  reservationStatus : {type:String, default:'blocked'},
  createdAt: {type:Date, default: getDateinIST() },
},{versionKey:false});

module.exports = mongoose.model('reservations', classTypeSchema);
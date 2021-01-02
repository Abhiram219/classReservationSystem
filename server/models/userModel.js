const mongoose = require('mongoose');
mongoose.pluralize(null);
const {getDateinIST,emailValidator,nameValidator,phoneNoValidator} = require('../utilities/utils')
const {Schema} = mongoose;

const userSchema = new Schema({
  name: {type:String, required:true, validate: nameValidator},
  email: {type:String, required:true, validate: emailValidator},
  phone: {
    countryCode: {type:String, default:'+91'},
    number: {type:Number, validate: phoneNoValidator}
  },
  coursesEnrolled : [mongoose.Schema.Types.ObjectId],
},{versionKey:false});

module.exports = mongoose.model('users', userSchema);
const mongoose = require('mongoose');
mongoose.pluralize(null);
const {nameValidator} = require('../utilities/utils')
const {Schema} = mongoose;

const classTypeSchema = new Schema({
  name: {type:String, required:true, validate: nameValidator},
  code: {type:String, required:true, unique:true},
},{versionKey:false});

module.exports = mongoose.model('classType', classTypeSchema);
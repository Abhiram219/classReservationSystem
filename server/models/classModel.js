mongoose.pluralize(null);
import { nameValidator, classStatusValidator } from '../utilities/utils'
const {Schema} = mongoose;

const classSchema = new Schema({
  name: {type:String, required:true, validate: nameValidator},
  classType: {type:mongoose.ObjectId, required:true},
  totalSessions: {type:Number, min: 0, required: true},
  noOfSeats: {type:Number, min: 0, required: true},
  seatsBooked: {type:Number, min: 0},
  status: {type:String, validate: classStatusValidator}
},{versionKey:false});

module.exports = mongoose.model('users', classSchema);
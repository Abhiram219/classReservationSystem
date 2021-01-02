const Class = require('../models/classModel');
const ClassType = require('../models/classTypeModel');
const url = require('url');

function classController(){

  async function getClass(req,res,next){

    try {
      let classes = await Class.find();
      // console.log(classes);
      return res.status(200).json(classes);
    } catch (error) {
      return next(error);
    }
    
  };

  async function postClass(req,res,next){

    try {

      let newClassObj = {
        name : req.body.name,
        classType : req.body.classType,
        totalSessions : req.body.totalSessions,
        numberOfSeats : req.body.numberOfSeats,
        startTime: req.body.startTime,
      }

      if(req.body.classType) {
        let classTypeCheck = await ClassType.findById(req.body.classType);
        if(classTypeCheck===null){
          return res.status(400).json({message:"Invalid class Type"})
        }
      }
      
      // As below two fields are not required as per our schema
      req.body.seatsBooked ? newClassObj.seatsBooked = req.body.seatsBooked : '';
      req.body.status ? newClassObj.status = req.body.status : '';

      let newClass = new Class({...newClassObj});
  
      await newClass.save();

      return res.status(201).json({message:'Class created sucessfully'});

    } catch (error) {
      return next(error);
    }

    
  }

  function getClassType(req,res,next){

  }

  function postClassType(req,res,next){

  }

  return {
    getClass,
    postClass,
    getClassType,
    postClassType,
  }

}

module.exports = classController;
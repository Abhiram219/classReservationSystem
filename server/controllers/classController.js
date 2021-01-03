const Class = require('../models/classModel');
const ClassType = require('../models/classTypeModel');
const url = require('url');
const classTypeModel = require('../models/classTypeModel');
const { Console } = require('console');

function classController(){

  async function getClass(req,res,next){

    try {
      const queryObj = url.parse(req.url, true).query;

      let filters = {};
      
      queryObj.classStatus ? filters.status = queryObj.classStatus : '';

      if(queryObj.classType){
        let classType = await ClassType.findOne({name : queryObj.classType});
        if(classType !== null) {
          filters.classType = classType._id 
        }else {
          return res.status(200).json({});
        } 
      }

      if(queryObj.startTime) {
        let date = new Date(parseInt(queryObj.startTime) + 19800000); // 19800000 = (5*60 + 30min)*60 * 1000
        filters.startTime = date;
      }

      let classes;
      let pageNumber = parseInt(queryObj.pageNumber), pageSize = parseInt(queryObj.pageSize);
      
      // Pagination Indexing starts from 0.
      if( pageNumber && pageSize ){
        console.log('In Pagination query')
        classes = await Class.find({...filters}).skip( pageNumber > 0 ? ( pageNumber * pageSize ) : 0 ).limit(pageSize);
      }else{
        classes = await Class.find({...filters});
      }


      // Mapping respective classTypes into classes
      await Promise.all( classes.map( async (item,index) => {
        let classType = await ClassType.findById(item.classType);
        if(ClassType !== null){
          let temp = {}
          temp.classTypeName = classType.name;
          temp.classTypeCode = classType.code;
          classes[index] = { ...classes[index]._doc, ...temp}
        }
      } ) );


      return res.status(200).json({data: classes});

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
      if(req.body.startTime) {
        let date = new Date(req.body.startTime + 19800000); // 19800000 = (5*60 + 30min)*60 * 1000
        newClassObj.startTime = date;
      }

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
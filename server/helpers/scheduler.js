
const mongoose = require('mongoose');

/*
* Scheduler runs after 5 min and check for the reservation Id
*/

function scheduler(Reservation, Class, reservationId){

  setTimeout( async ()=> {
    let session;
    
    try {
      let reservation = await Reservation.findById(reservationId);

      if(reservation.reservationStatus === 'blocked'){
   
        console.log('Scheduler is executing...')

        session = await mongoose.startSession();
        session.startTransaction();

        let classObj = await Class.findById(reservation.classId).session(session);
        classObj.blockedSeats = classObj.blockedSeats - 1;

        await classObj.save({session:session});

        reservation.reservationStatus = 'expired';

        await reservation.save({session:session});

        await session.commitTransaction();
        session.endSession()
      }

    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.log(err);
    }
      
    
  }, 300000 );
}

module.exports = scheduler
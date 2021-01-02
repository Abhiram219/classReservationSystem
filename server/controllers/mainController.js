const url = require('url');
const mongoose = require('mongoose');
const nodemailer = require("nodemailer");

function mainController(User, Class, Reservation) {

  async function confirmReservation(req, res, next) {
    let session;
    try {
      session = await mongoose.startSession();
      session.startTransaction();

      const queryObj = url.parse(req.url, true).query;
      const reservationId = queryObj.reservationId;

      let reservation = await Reservation.findById(reservationId).session(session);
      if (reservation === null) {
        return res.status(400).json({ message: "Reservation doesn't exists" });
      }
      if (reservation.reservationStatus === 'cancelled') {
        return res.status(200).json({ message: "Reservation is cancelled, cannot confirm cancelled Reservations" });
      }
      if (reservation.reservationStatus === 'confirmed') {
        return res.status(200).json({ message: "Reservation already confirmed" });
      }

      reservation.reservationStatus = 'confirmed';
      await reservation.save({ session: session });

      let classObj = await Class.findById(reservation.classId).session(session);
      if (classObj === null) {
        return res.status(400).json({ message: "Class is invalid" });
      }
      classObj.blockedSeats = classObj.blockedSeats - 1;
      classObj.seatsBooked = classObj.seatsBooked + 1;

      await classObj.save({ session: session });

      let user = await User.findById(reservation.userId).session(session);
      if (user === null) {
        return res.status(400).json({ message: "User is invalid" });
      }

      user.coursesEnrolled = [...user.coursesEnrolled,reservation.classId ]; //user.coursesEnrolled.push( mongoose.Types.ObjectId(reservation.classId) );

      await user.save({ session: session });

      await session.commitTransaction();
      session.endSession()

      return res.status(200).json({ message: "Reservation confirmed sucessfully" });

    } catch (error) {

      await session.abortTransaction();
      session.endSession();
      return next(error);
    }
  }

  async function cancelReservation(req, res, next) {
    let session;
    try {
      session = await mongoose.startSession();
      session.startTransaction();

      const queryObj = url.parse(req.url, true).query;
      const reservationId = queryObj.reservationId;

      let reservation = await Reservation.findById(reservationId).session(session);
      if (reservation === null) {
        return res.status(400).json({ message: "Reservation doesn't exists" });
      }
      if (reservation.reservationStatus === 'cancelled') {
        return res.status(200).json({ message: "Reservation already cancelled" });
      }

      reservation.reservationStatus = 'cancelled';
      await reservation.save({ session: session });

      let classObj = await Class.findById(reservation.classId).session(session);
      let user = await User.findById(reservation.userId).session(session);

      if (reservation.reservationStatus === 'blocked') {
        classObj.blockedSeats = classObj.blockedSeats - 1;
      } else {
        classObj.seatsBooked = classObj.seatsBooked - 1;
        user.coursesEnrolled = user.coursesEnrolled.filter( () => item !== reservation.classId);
        await user.save({ session: session });
      }

      await classObj.save({ session: session });


      await session.commitTransaction();
      session.endSession()

      return res.status(200).json({ message: "Reservation cancelled sucessfully" });

    } catch (error) {

      await session.abortTransaction();
      session.endSession();
      return next(error);
    }
  }

  async function reserveSeat(req, res, next) {
    let session;
    try {

      session = await mongoose.startSession();
      session.startTransaction();

      if (!req.body.class) {
        return res.status(400).json({ message: "Class is required to make a reservation" });
      }

      let classObj = await Class.findById(req.body.class).session(session);
      let userId;

      if (classObj === null) {
        return res.status(400).json({ message: "Class is invalid" });
      }

      if( classObj.numberOfSeats === classObj.seatsBooked + classObj.blockedSeats ){
        return res.status(400).json({ message: "No Seats are available for this class" });
      }

      let user = await User.find({ name: req.body.name, email: req.body.email, }).session(session);

      // User doesn't exists in db
      if (user === null || Object.keys(user).length === 0) {

        let newUser = new User({
          name: req.body.name,
          phone: req.body.phone,
          email: req.body.email,
        })

        let user = await newUser.save({ session: session });
        userId = user._id;
      } else {
        userId = user[0]._id;
      }

      let reservation = await Reservation.find({userId:userId, classId: classObj._id, reservationStatus:{$ne: 'cancelled'}});
      if( Object.keys(reservation).length !== 0 ){
        return res.status(400).json({message:`Reservation for the user to this class already exists. Id ${reservation[0]._id}`})
      }

      reservation = new Reservation({
        userId: userId,
        classId: req.body.class,
      });

      reservation = await reservation.save({ session: session });


      // Send Email
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'abhitest219@gmail.com',
          pass: 'qwerty@1234'
        }
      });

      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: 'abhitest219@gmail.com', // sender address
        to: req.body.email, // list of receivers
        subject: `Class ${classObj.name} Reservation`, // Subject line
        html: `<h1> Hi </h1> <a href=http://localhost:7800/api/confirmReservation?reservationId=${reservation._id} target='_blank'> Click to confirm Reservation</a>`, // html body
      });

      classObj.blockedSeats = classObj.blockedSeats + 1;
      await classObj.save({ session: session });

      await session.commitTransaction();
      session.endSession()

      return res.status(200).json({ message: "Seat blocked sucessfully" });

    } catch (error) {

      await session.abortTransaction();
      session.endSession();
      return next(error)
    }
  }

  function report(req, res, next) {

  }

  return {
    confirmReservation,
    cancelReservation,
    reserveSeat,
    report
  }

}

module.exports = mainController;
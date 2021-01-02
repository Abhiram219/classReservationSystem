
const classStatus = ['UPCOMING', 'ONGOING', 'COMPLETED']


const getDateinIST = () => {
  const now = new Date(); //Date in UTC
  const now_IST = now.getTime() + 19800000  // 19800000 = (5*60 + 30min)*60 * 1000
  return now_IST;
}

const emailValidator = (email) => {
  var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  
  if (reg.test(email) == false) {
    return false;
  }

  return true;
}

const phoneNoValidator = (number) => {
  const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
  return regex.test(number);
}

const nameValidator = (name) => {
  return name && name.length>1;
}

const classStatusValidator = (status) => {
  return classStatus.includes(status)
}

module.exports = {
  getDateinIST,
  emailValidator,
  phoneNoValidator,
  nameValidator,
  classStatusValidator
}

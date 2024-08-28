const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    sname: String,
    mothersName: String,
    fathersName: String,
    classStudy: String,
    dob: Date,
    gender: String,
    rollnumber: String,
    address: String,
    adhar: String,
    pan: String,
    tc: String,
    migration: String,
    cc: String,
    email: String,
    contact: String,
    contact2: String,
    image: String,
    admissionyear: String,
});

const Student = mongoose.model('studentOverview', studentSchema);

module.exports = Student;

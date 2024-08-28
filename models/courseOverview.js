const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: { type: String, required: true },
    classStudy: { type: String, required: true },
    year: { type: String, required: true },
    description: { type: String, required: true },
});

module.exports = mongoose.model('Course', courseSchema);

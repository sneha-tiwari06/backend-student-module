const mongoose = require('mongoose');
const attendanceSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    rollNumber: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Late'],
        required: true,
    },
    time: {
        type: String,
        required: function() {
            return this.status === 'Late';
        },
    },
    date: {
        type: Date,
        default: Date.now,
        required: true,
    },
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;


const mongoose = require('mongoose');

const remarkSchema = new mongoose.Schema({
    rollNumber: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Absent', 'Late'],
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    class: {
        type: String,
        required: false
    }
}, { timestamps: true });

const Remark = mongoose.model('Remark', remarkSchema);

module.exports = Remark;

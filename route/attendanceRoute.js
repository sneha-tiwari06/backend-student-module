const express = require('express');
const router = express.Router();
const Attendance = require('../models/attendance');

router.post('/attendance', async (req, res) => {
    try {
        const attendanceRecords = req.body.attendanceRecords;
        await Attendance.insertMany(attendanceRecords);
        res.status(200).json({ message: 'Attendance records saved successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save attendance records.' });
    }
});
router.get('/attendance/check', async (req, res) => {
    try {
        const { studentId } = req.query;
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        const attendance = await Attendance.findOne({ studentId, date: { $gte: today } });
        res.status(200).json({ marked: !!attendance });
    } catch (error) {
        res.status(500).json({ error: 'Failed to check attendance.' });
    }
});


router.get('/today/:rollnumber', async (req, res) => {
    try {
        const { rollnumber } = req.params;
        const startOfToday = new Date();
        startOfToday.setUTCHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setUTCHours(23, 59, 59, 999);

        // console.log(`Fetching attendance for Roll Number: ${rollnumber} from ${startOfToday} to ${endOfToday}`);

        const attendance = await Attendance.findOne({
            rollNumber: rollnumber,
            date: { $gte: startOfToday, $lte: endOfToday }
        });

        if (attendance) {
            res.status(200).json(attendance);
        } else {
            res.status(404).json({ message: 'Attendance not found' });
        }
    } catch (err) {
        console.error('Error fetching today\'s attendance:', err);
        res.status(500).json(err);
    }
});

// Get monthly attendance
router.get('/month/:rollnumber', async (req, res) => {
    try {
        const { rollnumber } = req.params;
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        startOfMonth.setUTCHours(0, 0, 0, 0);

        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
        endOfMonth.setUTCHours(23, 59, 59, 999);

        // console.log(`Fetching monthly attendance for Roll Number: ${rollnumber} from ${startOfMonth} to ${endOfMonth}`);

        const attendance = await Attendance.find({
            rollNumber: rollnumber,
            date: { $gte: startOfMonth, $lte: endOfMonth },
        });

        res.status(200).json(attendance);
    } catch (err) {
        console.error('Error fetching monthly attendance:', err);
        res.status(500).json(err);
    }
});
module.exports = router;

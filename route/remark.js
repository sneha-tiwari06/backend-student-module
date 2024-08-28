
const express = require('express');
const Remark = require('../models/remark');

const router = express.Router();

router.post('/add', async (req, res) => {
    const { rollNumber, date, status, reason } = req.body;

    try {
        const newRemark = new Remark({ rollNumber, date, status, reason });
        await newRemark.save();
        res.status(201).json(newRemark);
    } catch (error) {
        res.status(500).json({ message: 'Error saving remark', error });
    }
});


router.get('/:rollNumber', async (req, res) => {
    const { rollNumber } = req.params;

    try {
        const remarks = await Remark.find({ rollNumber });
        res.status(200).json(remarks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching remarks', error });
    }
});
router.get('/', async (req, res) => {
    try {
        const remarks = await Remark.find({});
        res.status(200).json(remarks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all remarks', error });
    }
});
module.exports = router;

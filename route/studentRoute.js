// routes/studentRoutes.js
const express = require('express');
const Student = require('../models/studentOverview.js');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('../cloudinary_config.js');

const router = express.Router();

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'school-management',
        format: async () => 'webp',
        public_id: (req, file) => file.originalname,
    },
});

const upload = multer({ storage: storage });

router.post('/students', upload.fields([
    { name: 'adhar' }, { name: 'pan' }, { name: 'tc' },
    { name: 'migration' }, { name: 'cc' }, { name: 'email' },
    { name: 'contact' }, { name: 'contact2' }, { name: 'image' }
]), async (req, res) => {
    try {
        const studentData = {
            sname: req.body.sname,
            mothersName: req.body.mothersName,
            fathersName: req.body.fathersName,
            classStudy: req.body.classStudy,
            dob: req.body.dob,
            gender: req.body.gender,
            rollnumber: req.body.rollnumber,
            address: req.body.address,
            email: req.body.email,
            contact: req.body.contact,
            contact2: req.body.contact2,
            adhar: req.files['adhar'] ? req.files['adhar'][0].path : '',
            pan: req.files['pan'] ? req.files['pan'][0].path : '',
            tc: req.files['tc'] ? req.files['tc'][0].path : '',
            migration: req.files['migration'] ? req.files['migration'][0].path : '',
            cc: req.files['cc'] ? req.files['cc'][0].path : '',
            image: req.files['image'] ? req.files['image'][0].path : '',
            admissionyear: req.body.admissionyear,
        };

        const newStudent = new Student(studentData);
        await newStudent.save();
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add student', error });
    }
});

router.get('/students', async (req, res) => {
    try {
        const { classStudy, year } = req.query;
        const query = {};
        if (classStudy) query.classStudy = classStudy;
        if (year) query.admissionyear = { $regex: year };

        const students = await Student.find(query);
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch students', error });
    }
});

router.get('/students/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).send('Student not found');
        res.json(student);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

router.get('/profile/:rollnumber', async (req, res) => {
    try {
      const { rollnumber } = req.params;
      const student = await Student.findOne({ rollnumber });
      if (!student) {
        return res.status(404).json({ msg: 'Student not found' });
      }
      res.json(student);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  router.get('/', async (req, res) => {
    try {
        const student = await Student.find({});
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all student', error });
    }
  });
module.exports = router;

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const app = express();
app.use(cors());
app.use(bodyParser.json());
const upload = multer({ dest: 'uploads/' });
const uri ='mongodb+srv://tiwarisneha491:Sneha%402012@schhol-mng-system.dw4c5a1.mongodb.net/?retryWrites=true&w=majority&appName=schhol-mng-system';

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((err) => console.error('Failed to connect to MongoDB Atlas', err));

const studentSchema = new mongoose.Schema({
    name: String,
    mothersName: String,
    fathersName: String,
    classStudy: String,
    dob: Date,
    gender: String,
    rollnumber: String,
    address: String,
    documents: String,
    image: String,
    admissionyear: String,
});

const Student = mongoose.model('studentOverview', studentSchema);

app.post('/api/students', upload.fields([{ name: 'documents' }, { name: 'image' }]), async (req, res) => {
    try {
        const studentData = {
            name: req.body.name,
            mothersName: req.body.mothersName,
            fathersName: req.body.fathersName,
            classStudy: req.body.classStudy,
            dob: req.body.dob,
            gender: req.body.gender,
            rollnumber: req.body.rollnumber,
            address: req.body.address,
            documents: req.files['documents'] ? req.files['documents'][0].path : '',
            image: req.files['image'] ? req.files['image'][0].path : '',
            admissionyear: req.body.admissionyear
        };

        const newStudent = new Student(studentData);
        await newStudent.save();
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add student', error });
    }
});
app.get('/api/students', async (req, res) => {
    try {
        const { classStudy, year } = req.query;
        const query = {};
        if (classStudy) query.classStudy = classStudy;
        if (year) query.dob = { $regex: year };

        const students = await Student.find(query);
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch students', error });
    }
});
app.get('/api/students/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).send('Student not found');
        res.json(student);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
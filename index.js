
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const corsOptions = {
    origin: function (origin, callback) {
      callback(null, origin);
    },
    credentials: true,
  };
  
app.use(cors(corsOptions));
app.use(bodyParser.json());

const uri = process.env.REACT_APP_DB_URI;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((err) => console.error('Failed to connect to MongoDB Atlas', err));

const studentRoutes = require('./route/studentRoute');
const attendanceRoutes = require('./route/attendanceRoute');
const courseRoutes = require('./route/courseOverview');
const libraryRoutes = require('./route/library');
app.use('/api/auth', require('./route/auth'));
app.use('/api/remarks', require('./route/remark'));
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/library', libraryRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

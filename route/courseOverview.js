
const express = require('express');
const router = express.Router();
const Course = require('../models/courseOverview');

router.post('/courses', async (req, res) => {
    const { courseName, classStudy, year, description } = req.body;
    

    console.log('Request Body:', req.body);

    try {
        if (!courseName || !classStudy || !year || !description) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newCourse = new Course({ courseName, classStudy, year, description });
        await newCourse.save();
        res.status(201).json(newCourse);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add course', error });
    }
});

router.get('/courses', async (req, res) => {
    const { classStudy, year } = req.query;
    try {
        const query = {};
        if (classStudy) query.classStudy = classStudy;
        if (year) query.year = { $regex: year };

        const courses = await Course.find(query);
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch courses', error });
    }
});

router.get('/courses/:id', async (req, res) => {
    try {
        const courses = await Course.findById(req.params.id);
        if (!courses) return res.status(404).send('Courses not found');
        res.json(courses);
    } catch (error) {
        res.status(500).send('Server error');
    }
});
router.put('/courses/:id', async (req, res) => {
    try {
        console.log('Request Body:', req.body);
        console.log('Course ID:', req.params.id);

        const { id } = req.params;
        const updatedCourse = await Course.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedCourse) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.json(updatedCourse);
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



  router.delete('/courses/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deletedCourse = await Course.findByIdAndDelete(id);
  
      if (!deletedCourse) {
        return res.status(404).json({ error: 'Course not found' });
      }
  
      res.json({ message: 'Course deleted successfully' });
    } catch (error) {
      console.error('Error deleting course:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  router.get('/courses', async (req, res) => {
    try {
      const courses = await CourseOverview.find();
      console.log('Courses route hit');
      res.json(courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).send('Server error');
    }
  });
module.exports = router;

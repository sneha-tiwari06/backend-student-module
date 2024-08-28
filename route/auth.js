const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const RegisteredUser = require('../models/RegisteredUsers');
const router = express.Router();
router.post('/register', async (req, res) => {
  const { rollNumber, email, password } = req.body;
  try {
    let user = await RegisteredUser.findOne({ rollNumber });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }
    const newUser = new RegisteredUser({
      rollNumber,
      email,
      password,
    });
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);
    await newUser.save();
    const payload = {
      user: {
        id: newUser.id,
      },
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
router.post('/login', async (req, res) => {
  const { rollNumber, password } = req.body;
  try {
    let user = await RegisteredUser.findOne({ rollNumber });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Incorrect Roll Number' }] });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Wrong Password' }] });
    }
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
module.exports = router;

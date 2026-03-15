const express = require('express');
const router = express.Router();
const User = require('../schemas/users');

// GET all users (exclude soft-deleted)
router.get('/', async function (req, res, next) {
  try {
    const users = await User.find({ isDeleted: false }).populate('role');
    res.send(users);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// GET user by id
router.get('/:id', async function (req, res, next) {
  try {
    const user = await User.findOne({ _id: req.params.id, isDeleted: false }).populate('role');
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.send(user);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// CREATE user
router.post('/', async function (req, res, next) {
  try {
    const newUser = new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      status: req.body.status,
      role: req.body.role,
      loginCount: req.body.loginCount,
    });

    const result = await newUser.save();
    res.status(201).send(result);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// UPDATE user
router.put('/:id', async function (req, res, next) {
  try {
    const updates = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      status: req.body.status,
      role: req.body.role,
      loginCount: req.body.loginCount,
    };

    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      updates,
      { new: true }
    ).populate('role');

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.send(user);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// SOFT DELETE user
router.delete('/:id', async function (req, res, next) {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    ).populate('role');

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.send({ message: 'User soft-deleted successfully', user });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// ENABLE user (set status true)
router.post('/enable', async function (req, res, next) {
  try {
    const user = await User.findOneAndUpdate(
      {
        username: req.body.username,
        email: req.body.email,
        isDeleted: false,
      },
      { status: true },
      { new: true }
    ).populate('role');

    if (!user) {
      return res.status(404).send({ message: 'User not found or already deleted' });
    }

    res.send({ message: 'User enabled', user });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// DISABLE user (set status false)
router.post('/disable', async function (req, res, next) {
  try {
    const user = await User.findOneAndUpdate(
      {
        username: req.body.username,
        email: req.body.email,
        isDeleted: false,
      },
      { status: false },
      { new: true }
    ).populate('role');

    if (!user) {
      return res.status(404).send({ message: 'User not found or already deleted' });
    }

    res.send({ message: 'User disabled', user });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Role = require('../schemas/roles');
const User = require('../schemas/users');

// GET all (exclude soft-deleted)
router.get('/', async function (req, res, next) {
  try {
    const roles = await Role.find({ isDeleted: false });
    res.send(roles);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// GET users by role id
router.get('/:id/users', async function (req, res, next) {
  try {
    const users = await User.find({ role: req.params.id, isDeleted: false }).populate('role');
    res.send(users);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// GET by id
router.get('/:id', async function (req, res, next) {
  try {
    const role = await Role.findOne({ _id: req.params.id, isDeleted: false });
    if (!role) {
      return res.status(404).send({ message: 'Role not found' });
    }
    res.send(role);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// CREATE
router.post('/', async function (req, res, next) {
  try {
    const newRole = new Role({
      name: req.body.name,
      description: req.body.description,
    });
    const result = await newRole.save();
    res.status(201).send(result);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// UPDATE
router.put('/:id', async function (req, res, next) {
  try {
    const role = await Role.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      {
        name: req.body.name,
        description: req.body.description,
      },
      { new: true }
    );

    if (!role) {
      return res.status(404).send({ message: 'Role not found' });
    }

    res.send(role);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// SOFT DELETE
router.delete('/:id', async function (req, res, next) {
  try {
    const role = await Role.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!role) {
      return res.status(404).send({ message: 'Role not found' });
    }

    res.send({ message: 'Role soft-deleted successfully', role });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = router;

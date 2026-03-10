var express = require('express');
var router = express.Router();
let productModel = require('../schemas/products')


// GET
router.get('/:id', async function(req, res, next) {
  try {
    let product = await productModel.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }
    res.send(product);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// CREATE
router.post('/', async function(req, res, next) {
  try {
    let newProduct = new productModel({
      title: req.body.title,
      slug: req.body.slug,
      price: req.body.price,
      description: req.body.description,
      images: req.body.images,
      category: req.body.category,
      isDeleted: req.body.isDeleted || false
    });
    let result = await newProduct.save();
    res.status(201).send(result);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// UPDATE
router.put('/:id', async function(req, res, next) {
  try {
    let product = await productModel.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        slug: req.body.slug,
        price: req.body.price,
        description: req.body.description,
        images: req.body.images,
        category: req.body.category,
        isDeleted: req.body.isDeleted
      },
      { new: true }
    ).populate('category');
    
    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }
    res.send(product);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// DELETE
router.delete('/:id', async function(req, res, next) {
  try {
    let product = await productModel.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }
    res.send({ message: 'Product deleted successfully', product });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});


module.exports = router;

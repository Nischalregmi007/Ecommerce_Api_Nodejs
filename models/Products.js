const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true

  },
  price: {
    type: Number,
    required: true,
    unique: false
  },
  stock: {
    type: Number,
    required: true,
    unique: false
  },
  category: {
    type: String,
    required: true,
    unique: false
  },
  image: {
    type: String,
    required: true,
    unique: false
  }
});

module.exports = mongoose.model('Products', productSchema);

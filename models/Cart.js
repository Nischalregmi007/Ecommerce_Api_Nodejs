const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Products',
    required: true,
    unique: true

  },
  stock: {
    type: String,
    required: true,
    unique: false
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref:'User',
    required: true,
    unique: false
  }

});

module.exports = mongoose.model('Cart', cartSchema);

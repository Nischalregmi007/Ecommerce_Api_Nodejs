const express = require('express');
const productController = require('../controllers/productController');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const isadmin = require('../middleware/isadmin');
const router = express.Router();

// Register route
router.post('/register', upload.single('image'), auth, isadmin,  productController.registerProduct);
router.patch('/edit/:id', upload.single('image'), auth, isadmin,  productController.editProduct);
router.get('/', auth, productController.getProduct);
router.delete('/delete/:id', auth, isadmin,  productController.deleteProduct);

module.exports = router;

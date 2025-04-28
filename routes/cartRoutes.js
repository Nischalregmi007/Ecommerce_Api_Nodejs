const express = require('express');
const cartController = require('../controllers/cartController');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const isadmin = require('../middleware/isadmin');
const router = express.Router();

// Register route
router.post('/add',  auth,   cartController.addtoCart);
router.delete('/delete/:id',  auth,   cartController.deletefromCart);
router.put('/update/:id',  auth,   cartController.updatestockfromCart);
router.get('/', auth,   cartController.getinfofromCart);


module.exports = router;

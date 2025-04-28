const express = require('express');
const orderController = require('../controllers/orderController');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const isadmin = require('../middleware/isadmin');
const router = express.Router();

// Register route
router.post('/make_order',  auth,   orderController.makeOrder);
router.get('/current_order',  auth,  orderController.getcurrentOrder);
router.get('/order_history',  auth,  orderController.getorderHistory);
router.put('/update_status/:id',  auth,  isadmin, orderController.updateStatus);
router.get('/invoice/:id',  auth, orderController.downloadInvoice);


module.exports = router;

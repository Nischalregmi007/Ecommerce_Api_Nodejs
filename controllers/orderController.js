const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Products');
const PDFDocument = require('pdfkit');
const User = require('../models/User');

exports.makeOrder = async (req, res) => {
    try {
        const shippingAddress = req.body.shippingAddress;
        const carts = await Cart.find({ user: req.userId });
        let totalPrice = 0;
        const items = [];
        for (const cart of carts) {
            const product_id = cart.product;
            const product = await Product.findById(product_id);
            const quantity = cart.stock;
            if (quantity > product.stock) {
                return res.status(403).json({ message: 'Stock out of bound!!!' });
            }
            items.push({
                product: product,
                quantity: quantity,
            });
            product.stock = product.stock - cart.stock;
            price_cart = product.price * cart.stock;
            totalPrice = totalPrice + price_cart;
        }
        const new_order = new Order({
            user: req.userId,
            items,
            totalPrice,
            shippingAddress
        });
        const saved_order = await new_order.save();
        return res.status(200).json({ message: 'Order Created Sucessfully', saved_order });

    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getcurrentOrder = async (req, res) => {
    try {
        if (req.userRole === "customer") {
            const orders = await Order.find({ user: req.userId, orderStatus: { $in: ['processing', 'shipped'] } });
            if (!orders) {
                return res.status(404).json({ message: 'No current order' });
            }
            return res.status(200).json({ orders });
        }
        const orders = await Order.find({ orderStatus: { $in: ['processing', 'shipped'] } });
        if (!orders) {
            return res.status(404).json({ message: 'No current order' });
        }
        res.status(200).json({ orders });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getorderHistory = async (req, res) => {
    try {
        if (req.userRole === "customer") {
            const orders = await Order.find({ user: req.userId, orderStatus: { $in: ['delivered', 'cancelled'] } });
            if (orders.length === 0) {
                return res.status(404).json({ message: 'No order History' });
            }
            return res.status(200).json({ orders });
        }
        const orders = await Order.find({ orderStatus: { $in: ['delivered', 'cancelled'] } });
        if (orders.length === 0) {
            return res.status(404).json({ message: 'No order History' });
        }
        res.status(200).json({ orders });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.updateStatus = async (req, res) => {
    try {
        const order_id = req.params.id;
        const { orderStatus, paymentStatus } = req.body;
        const order = await Order.findById(order_id);
        order.orderStatus = orderStatus;
        order.paymentStatus = paymentStatus;
        const saved_order = await order.save();
        res.status(200).json({ message: 'Updated Sucessfully' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.downloadInvoice = async (req, res) => {
    try {
        const order_id = req.params.id;
        const order = await Order.findById(order_id).populate('items.product');
        if (order.orderStatus != "delivered" || order.paymentStatus != "paid") {
            return res.status(403).json({ message: 'Let your order be delivered and pay first!!!' });
        }
        const user = await User.findById(req.userId);
        // Create a PDF document
        const doc = new PDFDocument();

        // Pipe PDF to response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
        doc.pipe(res);
        // Invoice Header
        doc
            .fontSize(20)
            .text('INVOICE', { align: 'center' })
            .moveDown();

        // User Info
        doc
            .fontSize(12)
            .text(`Customer Name: ${user.username}`)
            .text(`Shipping Address: ${order.shippingAddress}`)
            .text(`Order Date: ${order.createdAt.toDateString()}`)
            .moveDown();

        // Table Header
        doc
            .fontSize(14)
            .text('Items:', { underline: true })
            .moveDown(0.5);

        // Items
        order.items.forEach((item, index) => {
            doc
                .fontSize(12)
                .text(`${index + 1}. ${item.product.name} (Qty: ${item.quantity}) - $${item.product.price}`);
        });

        doc.moveDown();

        // Total Price
        doc
            .fontSize(14)
            .text(`Total Price: $${order.totalPrice}`, { align: 'right' });

        doc.end();
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }
}
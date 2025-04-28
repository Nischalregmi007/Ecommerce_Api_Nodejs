const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');


const app = express();
connectDB();

app.use(cors());
app.use(express.json());



app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);


app.use('/uploads', express.static('uploads'));
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

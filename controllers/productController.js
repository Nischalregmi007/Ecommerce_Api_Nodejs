const Product = require('../models/Products');


exports.registerProduct = async (req, res) => {
    try {
        const { name, price, stock, category } = req.body;
        const image = req.file ? req.file.filename : null;
        if (!name || !price || !stock || !category) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }
        const newProduct = new Product({
            name,
            price,
            stock,
            category,
            image
        });
        const savedProduct = await newProduct.save();
        res.status(201).json({
            message: 'Product created successfully!',
            product: savedProduct,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};
exports.editProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, price, stock, category } = req.body;
        const image = req.file ? req.file.filename : null;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        product.name = name;
        product.price = price;
        product.stock = stock;
        product.category = category;
        product.image = image;
        return res.status(200).json({ message: 'Product edited sucessfully', edited_product: product });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getProduct = async (req, res) => {
    try {
        const products = await Product.find();
        if (!products) {
            return res.status(404).json({ message: 'No Products Found!!!' });
        }
        return res.status(200).json({ products: products });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Product Deleted Sucessfully' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.searchProduct = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.status(400).json({ message: 'Query is required' });

        const products = await Product.find({
            $or: [
                { name: { $regex: query, $options: 'i' } }, // case-insensitive search
                { category: { $regex: query, $options: 'i' } }
            ]
        });

        res.json(products);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.filterProduct = async (req, res) => {
    try {
        const { category, minprice, maxprice, stock } = req.body;

        const query = {};

        if (category) {
            query.category = category;
        }

        if (stock !== undefined) {
            query.stock = { $gte: stock };
        }

        if (minprice !== undefined || maxprice !== undefined) {
            query.price = {};
            if (minprice !== undefined) query.price.$gte = minprice;
            if (maxprice !== undefined) query.price.$lte = maxprice;
        }

        const products = await Product.find(query);
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }
};



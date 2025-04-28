const Cart=require('../models/Cart');
const Product=require('../models/Products');

exports.addtoCart= async(req, res)=>{
    try{
        const {product_id, stock}=req.body;
        if(!product_id || !stock){
            return res.status(400).json({message:'Please provide all required fields'});
        }
        const product = await Product.findById(product_id);
        const actual_stock =product.stock;
        if(stock>actual_stock){
            return res.status(403).json({message:'Stock out of bound!!!!'});
        }
        const newcart = new Cart({
            product:product_id,
            stock,
            user:req.userId
        });
        const savedcart= await newcart.save();
        return res.status(200).json({message: 'Added To Cart Sucessfully', item:savedcart});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:'Server Error'});
    }
};
exports.deletefromCart=async(req, res)=>{
    try{
        const cart_id=req.params.id;
        const deleted=await Cart.findByIdAndDelete(cart_id);
        return res.status(200).json({message:'Deleted',deleted});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:'Server Error'});
    }
};
exports.updatestockfromCart=async(req, res)=>{
    try{
        const cart_id=req.params.id;
        const stock=req.body.stock;
        cart=await Cart.findById(cart_id);
        const product_id=cart.product;
        const product =await Product.findById(product_id);
        const actual_stock=product.stock;
        if(stock>actual_stock){
            return res.status(403).json({message:'Stock out of bound!!!'});
        }
        if(!cart){
            return res.status(404).json({message:'Cart item not found!!!'});
        }
        cart.stock=stock;
        await cart.save();
        return res.status(200).json({message:'Stock updated Sucessfully', cart});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:'Server Error'});
    }
};

exports.getinfofromCart=async(req, res)=>{
    try{
        if(req.userRole==="admin"){
            const carts=await Cart.find();
            return res.status(200).json({carts});
        }
        const carts = await Cart.find({ user: req.userId });
        if(carts.length === 0){
            return res.status(404).json({message:'Not Found!!!'});
        }
        return res.status(200).json({carts});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:'Server Error'});
    }
}

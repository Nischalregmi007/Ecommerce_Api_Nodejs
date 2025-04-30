const User =require('../models/User');
const sendOTP=require('../utils/mailer');
exports.getuserDetails=async(req, res)=>{
    try{
        const users = await User.find({}, { otp: 0, expiryDate: 0 });
        if(users.length===0){
            return res.status(404).json({message:'No users found'});
        }
        return res.status(200).json({users});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:'Server Error'});
    }
};

exports.deleteUser=async(req, res)=>{
    try{
        const user_id=req.params.id;
        const delete_user=await User.findByIdAndDelete(user_id);
        if(!delete_user){
            return res.status(404).json({message:'User Not Found!!!'});
        }
        delete_user.save();
        res.status(200).json({message:'User Banned Sucessfully'});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:'Server Error'});
    }
};

exports.otpGenerate=async(req, res)=>{
    try{
        const user= await User.findById(req.userId);
        const otp=Math.floor(100000 + Math.random() * 900000).toString();
        sendOTP(user.email, otp); 
        user.otp=otp;
        user.otpExpires=new Date(Date.now() + 2 * 60 * 1000);
        const saved_otp=await user.save();
        res.status(200).json({message:'Otp Sent Sucessfully!!!', saved_otp});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:'Server Error'});
    }
};
exports.passwordChange=async(req, res)=>{
    try{
        const {otp, new_password}=req.body;
        const user=await User.findById(req.userId);
        if ( user.otp !== otp || Date.now() > user.otpExpires) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
        user.password=new_password;
        user.otp = undefined;
        user.otpExpires = undefined;
        const saved_user=await user.save();
        res.status(200).json({message:'Password Changed Sucessfully', saved_user});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:'Server Error'});
    }
};


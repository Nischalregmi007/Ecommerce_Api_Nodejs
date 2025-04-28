const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = 'u9#kjJ8z!kXP?bRg7z!dTwr@2Tx+4'; // Secret key for JWT
const REFRESH_SECRET ='u9#kjJ8z!kXP?bRg4z!dTwr@2Tx+9';
// Register new user
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // Create a new user
    const newUser = new User({ username, email, password, role: 'customer'});
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login existing user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if(!user){
        return res.status(404).json({message:'User not found!!!'});
    }


    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    if (user.email=="admin@gmail.com" && password=="admin123"){
        user.role="admin";
        await user.save();
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id, userRole: user.role }, JWT_SECRET, { expiresIn: '1h' });
    const refresh_token = jwt.sign({ userId: user._id, userRole: user.role }, REFRESH_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token, refresh_token});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }

};
exports.refreshToken = (req, res) => {
  const { token } = req.body;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, REFRESH_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const token = jwt.sign({ userId: user._id, userRole: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({messege:'Refresh Sucessfull', token });
  });
};


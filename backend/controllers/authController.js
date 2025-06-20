const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    console.log("📥  req.body:", req.body); 
    try {
        const { name, email, password } = req.body; // Remove role from destructuring
        
        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ 
                message: "Name, email, and password are required" 
            });
        }
        
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: "email exist dejat" })
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = new User({
            name, 
            email,
            password: hashedPassword,
            role: 'client', // Default role for all new registrations
        });
        
        await newUser.save();
        res.status(201).json({ message: 'user saved successfully' });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ 
            message: 'erreur server',
            error: err.message 
        });
    }
};

const loginUser = async(req, res) => {
    try {
        const {email, password} = req.body;
        
        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ 
                message: "Email and password are required" 
            });
        }
        
        const user = await User.findOne({email});
        if(!user)
            return res.status(400).json({message:"Email ou mot de passe incorrect"});
            
        const PwdValidation = await bcrypt.compare(password, user.password);
        if(!PwdValidation)
            return res.status(400).json({message:"Email ou mot de passe incorrect"});
        
        const token = jwt.sign(
           {id:user._id , role: user.role},
           process.env.JWT_SECRET || 'your-secret-key',
           {expiresIn: process.env.JWT_EXPIRES || '2d'}
        );
        
        res.status(200).json({
            message: "connexion réussie",
            token,
            user: {
                id: user._id, 
                name: user.name,
                email: user.email, 
                role: user.role
            }
        });
    } catch(err) {
        console.error("Login error:", err);
        res.status(500).json({message: "Erreur serveur"})
    }
};

module.exports = {registerUser, loginUser};

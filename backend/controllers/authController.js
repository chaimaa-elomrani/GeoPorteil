const User = require('../models/User');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        const exists = await User.findOne({ email });

        if (exists) {
            return res.status(400).json({ message: "email exist dejat" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const newUser = new User({
            email,
            password: hashedPassword,
            role: role,
        });

        await newUser.save();

        res.status(201).json({ message: 'user saved successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'erreur server' });
    }
};

module.exports = {registerUser}; 

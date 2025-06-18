const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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



const loginUser = async(req, res)=>{
    try{
        const {email, password} = req.body; 
        const user = await User.findOne({email}); 

        if(!user)
            return res.status(400).json({message:"Email ou mot de passe incorrect"});

        const PwdValidation = await bcrypt.compare(password, user.password); 

        if(!PwdValidation)
            return res.status(400).json({message:"Email ou mot de passe incorrect"});

        // approved or not redirection will be here 

        const token = jwt.sign(
           {id:user._id , role: user.role}, 
           process.env.JWT_EXPIRES, 
           {expiresIn: process.env.JWT_EXPIRES || '2d'}
        );

        res.status(200).json({
            message: "connexion réussie",
            token, 
            user: {id:user._id , email:user.email , role:user.role}

        });
    }catch(err){
        console.error(err);
        res.status(500).json({message: "Erreur serveur"})
    }
};

module.exports = {registerUser, loginUser}; 
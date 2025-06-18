const express = require('express');
const router = express.Router();
const {registerUser, loginUser} = require('../controllers/authController');
const {verifyToken , checkRole} = require('../middleware/auth');

router.post('/register', registerUser);
router.get('/login', loginUser);
router.get('/api/create' , verifyToken , (req,res)=> {
    res.json({msg: 'accés autorisé', })
})
module.exports = router; 


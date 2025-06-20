const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader)
        return res.status(400).json({message: "Pas de token"});
    
    // Fixed: Use split(' ') instead of split('')
    const token = authHeader.split(' ')[1];
    
    try{
        // Fixed: JWT_SECRET instead of JWT_SERCRET (typo)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(err){
        return res.status(401).json({message: 'token invalide'});
    }
};


const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user.role;
        if(!allowedRoles.includes(userRole)){
            return res.status(403).json({message: "Accès interdit"});
        }
        next();
    };
};


// Fixed: Proper export syntax
module.exports = {
    verifyToken,
    checkRole
};

const jwt = require('jsonwebtoken');

// Criamos o token usando uma chave secreta que só o nosso servidor conhece
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' } // Expiração curta = Boa prática de segurança
    );
};

module.exports = { generateToken };

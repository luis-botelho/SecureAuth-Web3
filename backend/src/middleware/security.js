const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Mitigação de Brute Force
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Limita cada IP a 5 tentativas de login por janela
    message: { message: "Muitas tentativas de login. Tente novamente em 15 minutos." }
});

module.exports = { helmet, loginLimiter };

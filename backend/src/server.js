require('dotenv').config();
const express = require('express');
const { helmet, loginLimiter } = require('./middleware/security');
const { login } = require('./auth/authController');

const app = express();

// Middlewares Globais
app.use(helmet()); // Protege Headers HTTP
app.use(express.json()); // Permite ler JSON no corpo da requisição

// Rota de Login com Rate Limit (Proteção contra Brute Force)
app.post('/api/login', loginLimiter, login);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor de Engenharia rodando na porta ${PORT}`);
});

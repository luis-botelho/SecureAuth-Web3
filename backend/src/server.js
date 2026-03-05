require('dotenv').config();
const express = require('express');
const { helmet, loginLimiter } = require('./middleware/security');
const { login, requestNonce, verifyWeb3 } = require('./auth/authController');

const app = express();
// ============================================================================
// MIDDLEWARES GLOBAIS
// ============================================================================

app.use(helmet()); // Proteção de Headers HTTP (Security Headers)
app.use(express.json()); // Parser para requisições JSON

// ============================================================================
// ROTAS DE AUTENTICAÇÃO
// ============================================================================

// Web2: Autenticação tradicional (Email/Senha)
app.post('/api/login', loginLimiter, login);

// Web3: Autenticação via Blockchain
app.post('/api/auth/request-nonce', requestNonce);    // Solicita desafio (nonce)
app.post('/api/auth/verify-web3', verifyWeb3);        // Verifica assinatura

// ============================================================================
// INICIALIZAÇÃO DO SERVIDOR
// ============================================================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor de Autenticação Web3 rodando na porta ${PORT}`);
    console.log(`📋 Endpoints disponíveis:`);
    console.log(`   - POST /api/login                 (Web2)`);
    console.log(`   - POST /api/auth/request-nonce    (Web3)`);
    console.log(`   - POST /api/auth/verify-web3      (Web3)`);
});

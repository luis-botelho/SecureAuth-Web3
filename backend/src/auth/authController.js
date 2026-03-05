/**
 * Auth Controller
 * Gerencia autenticação Web2 (email/senha) e Web3 (assinatura de carteira)
 */

const { comparePassword } = require('./hashService');
const { generateToken } = require('./authService');
const { PrismaClient } = require('@prisma/client');
const { verifyMessage } = require('ethers');
const crypto = require('crypto');

const prisma = new PrismaClient();

// ============================================================================
// WEB2 AUTHENTICATION - Email/Senha
// ============================================================================

/**
 * Login tradicional com email e senha
 * @route POST /api/login
 * @param {string} email - Email do usuário
 * @param {string} password - Senha em texto plano
 * @returns {object} JWT token
 */
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Validar entrada
        if (!email || !password) {
            return res.status(400).json({ message: "Email e senha são obrigatórios" });
        }

        // 2. Busca no banco de dados
        const user = await prisma.user.findUnique({ where: { email } });

        // SGSI: Se não achar, ou se for erro de senha, a resposta é a mesma
        // Evita enumeração de usuários
        if (!user || !user.passwordHash) {
            return res.status(401).json({ message: "Usuário ou senha inválidos" });
        }

        // 3. Comparar a senha com o Hash criptografado (Bcrypt)
        const isMatch = await comparePassword(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: "Usuário ou senha inválidos" });
        }

        // 4. Gerar JWT com ID do usuário
        const token = generateToken(user.id);

        // 5. Retornar token de acesso
        return res.status(200).json({ 
            message: "Autenticado com sucesso!",
            token 
        });

    } catch (error) {
        console.error("[LOGIN_ERROR]:", error.message);
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
};

// ============================================================================
// WEB3 AUTHENTICATION - Blockchain
// ============================================================================

/**
 * Solicita um desafio (nonce) para assinatura
 * Gera um nonce único que o usuário deve assinar com sua carteira
 * @route POST /api/auth/request-nonce
 * @param {string} walletAddress - Endereço da carteira Ethereum
 * @returns {object} Nonce para ser assinado pelo usuário
 */
const requestNonce = async (req, res) => {
    const { walletAddress } = req.body;

    try {
        // 1. Validar se o endereço da carteira foi enviado
        if (!walletAddress) {
            return res.status(400).json({ 
                message: "Endereço da carteira é obrigatório" 
            });
        }

        // 2. Validar formato do endereço (Ethereum começa com 0x)
        if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
            return res.status(400).json({ 
                message: "Endereço de carteira inválido" 
            });
        }

        // 3. Gerar um nonce aleatório e único (16 bytes = 32 caracteres hex)
        const nonce = crypto.randomBytes(16).toString('hex');

        // 4. Salvar ou atualizar o usuário com o nonce
        const user = await prisma.user.upsert({
            where: { walletAddress: walletAddress.toLowerCase() },
            update: { nonce },
            create: { 
                walletAddress: walletAddress.toLowerCase(), 
                nonce 
            }
        });

        // 5. Retornar a mensagem que deve ser assinada
        return res.status(200).json({ 
            message: `Assine esta mensagem para entrar: ${nonce}`,
            nonce,
            walletAddress: user.walletAddress
        });

    } catch (error) {
        console.error("[REQUEST_NONCE_ERROR]:", error.message);
        return res.status(500).json({ 
            message: "Erro ao gerar desafio de autenticação" 
        });
    }
};

/**
 * Verifica a assinatura criptográfica e autentica o usuário
 * Recupera o endereço da carteira que assinou a mensagem e valida
 * @route POST /api/auth/verify-web3
 * @param {string} walletAddress - Endereço da carteira
 * @param {string} signature - Assinatura gerada pelo usuário
 * @returns {object} JWT token se a assinatura for válida
 */
const verifyWeb3 = async (req, res) => {
    const { walletAddress, signature } = req.body;

    try {
        // 1. Validações iniciais
        if (!walletAddress || !signature) {
            return res.status(400).json({ 
                message: "Endereço da carteira e assinatura são obrigatórios" 
            });
        }

        // 2. Buscar o usuário e o nonce que geramos anteriormente
        const user = await prisma.user.findUnique({
            where: { walletAddress: walletAddress.toLowerCase() }
        });

        if (!user) {
            return res.status(401).json({ 
                message: "Usuário não encontrado. Solicite um nonce primeiro." 
            });
        }

        if (!user.nonce) {
            return res.status(401).json({ 
                message: "Desafio de autenticação não encontrado ou expirado." 
            });
        }

        // 3. Construir a mensagem exata que foi assinada
        const message = `Assine esta mensagem para entrar: ${user.nonce}`;

        // 4. RECUPERAÇÃO CRIPTOGRÁFICA via ECDSA
        // verifyMessage recupera o endereço que assinou a mensagem
        let recoveredAddress;
        try {
            recoveredAddress = verifyMessage(message, signature);
        } catch (error) {
            console.error("[SIGNATURE_VERIFY_ERROR]:", error.message);
            return res.status(401).json({ 
                message: "Assinatura inválida ou corrompida." 
            });
        }

        // 5. Validação final: comparar endereço recuperado com endereço enviado
        if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
            return res.status(401).json({ 
                message: "Assinatura inválida. Permissão negada." 
            });
        }

        // 6. SEGURANÇA: Inutilizar o nonce após o uso (mitiga Replay Attack)
        await prisma.user.update({
            where: { id: user.id },
            data: { nonce: null }
        });

        // 7. Gerar JWT com ID do usuário para acesso autorizado
        const token = generateToken(user.id);

        // 8. Retornar token de acesso
        return res.status(200).json({ 
            message: "Autenticado com sucesso via Web3!",
            token,
            walletAddress: user.walletAddress
        });

    } catch (error) {
        console.error("[WEB3_AUTH_ERROR]:", error.message);
        return res.status(500).json({ 
            message: "Erro ao processar assinatura criptográfica." 
        });
    }
};

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = { 
    login,           // Web2: Email/Senha
    requestNonce,    // Web3: Solicita nonce
    verifyWeb3       // Web3: Verifica assinatura
};
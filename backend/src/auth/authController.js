const { comparePassword } = require('./hashService');
const { generateToken } = require('./authService');

const login = async (req, res) => {
    const { email, password } = req.body;

    // Simulação de usuário (No futuro vira uma busca no Banco de Dados)
    const userMock = { email: 'dev@test.com', passwordHash: 'HASH_GERADO_PELO_BCRYPT' };

    try {
        // 1. Validar se o usuário existe
        if (email !== userMock.email) {
            return res.status(401).json({ message: "Usuário ou senha inválidos" });
        }

        // 2. Comparar a senha enviada com o Hash seguro
        const isMatch = await comparePassword(password, userMock.passwordHash);
        if (!isMatch) {
            // SGSI: Mensagem genérica para evitar enumeração de usuários
            return res.status(401).json({ message: "Usuário ou senha inválidos" });
        }

        // 3. Gerar o passaporte de acesso (JWT)
        const token = generateToken(userMock.email);
        res.json({ token });

    } catch (error) {
        res.status(500).json({ message: "Erro interno no servidor" });
    }
};

module.exports = { login };

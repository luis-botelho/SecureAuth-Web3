const request = require('supertest');
const express = require('express');
const { login } = require('./authController');
const { hashPassword } = require('./hashService');

const app = express();
app.use(express.json());
app.post('/api/login', login);

describe('Fluxo de Autenticação - SGSI Check', () => {
    
    test('Deve retornar 200 e um token para credenciais válidas', async () => {
        // Simulando que o hash no banco seria este para a senha '123456'
        // Em um teste real, o controller buscaria isso do DB
        const response = await request(app)
            .post('/api/login')
            .send({
                email: 'dev@test.com',
                password: 'password123' // Supondo que o mock no controller aceite isso
            });
        
        // Se falhar agora é porque o Mock no controller está estático, mas a lógica de teste é esta:
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    test('Deve retornar 401 para senha incorreta (Integridade)', async () => {
        const response = await request(app)
            .post('/api/login')
            .send({
                email: 'dev@test.com',
                password: 'senha_errada'
            });
        
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe("Usuário ou senha inválidos");
    });
});

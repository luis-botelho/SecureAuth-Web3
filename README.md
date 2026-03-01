# 🛡️ SecureAuth-Web3

Sistema de Autenticação Híbrida (Web2 + Web3) desenvolvido com foco em Segurança da Informação, arquitetura escalável e boas práticas modernas de engenharia.

Este projeto demonstra a implementação de um fluxo de autenticação seguro combinando login tradicional (email/senha) com autenticação descentralizada via assinatura de carteira blockchain.

---

## 🎯 Visão do Projeto

O SecureAuth-Web3 aplica na prática:

- SGSI baseado na ISO/IEC 27001  
- Mitigação de riscos do OWASP Top 10  
- Arquitetura desacoplada (Frontend + Backend)  
- Autenticação Stateless com JWT  
- Hashing adaptativo com Bcrypt  
- Assinatura criptográfica (Web3 Ready)  

O objetivo é demonstrar domínio técnico em segurança aplicada ao desenvolvimento web moderno.

---

## 🏗️ Arquitetura

O sistema segue princípios de separação de responsabilidades e defesa em profundidade:

- Frontend desacoplado (React)
- Backend estruturado com middlewares de segurança
- Autenticação stateless com JWT
- Controle de acesso via verificação de token
- Estrutura preparada para autenticação Web3 com assinatura de mensagem

---

## 🔐 Controles de Segurança Implementados

✔ Hash de senha com Bcrypt (cost factor 12)  
✔ Sanitização e validação de input  
✔ Proteção contra enumeração de usuários  
✔ JWT com expiração curta  
✔ Security Headers com Helmet  
✔ Rate Limiting contra brute force  
✔ Logs de auditoria (sem armazenamento de credenciais)  
✔ Tratamento seguro de erros  

Exemplo de resposta segura:

```
"Usuário ou senha inválidos"
```

---

## 🌐 Autenticação Web3 (Planejada)

Fluxo de autenticação descentralizada:

1. Conexão com carteira (MetaMask)
2. Geração de nonce no backend
3. Assinatura de mensagem pelo usuário
4. Validação criptográfica no servidor
5. Emissão de JWT

Esse modelo permite validar a posse da chave privada sem exposição de dados sensíveis.

---

## 🚀 Stack Tecnológica

### Backend
- Node.js
- Express
- Bcrypt
- JSON Web Token (JWT)
- Helmet
- Express-rate-limit
- Express-validator

### Frontend
- React.js
- Hooks
- Context API
- Axios

### Web3 Ready
- Ethers.js
- Wagmi
- MetaMask

---

## 📂 Estrutura do Projeto

```
secureauth-web3/
├── backend/
│   └── src/
│       ├── auth/
│       ├── middleware/
│       └── server.js
├── frontend/
│   └── src/
│       ├── components/
│       ├── context/
│       └── services/
└── docs/
```

---

## 📊 Ameaças Consideradas

- SQL Injection  
- XSS  
- CSRF  
- Credential Stuffing  
- Brute Force  
- Session Hijacking  
- User Enumeration  

---

## 🧠 Diferenciais Técnicos

- Aplicação prática de conceitos de SGSI
- Mentalidade de segurança desde a modelagem
- Arquitetura preparada para Web3
- Estrutura pensada para evolução (Docker, PostgreSQL, testes automatizados)

---

## 🛣️ Roadmap

- Implementação completa da autenticação Web2
- Implementação da autenticação Web3
- Refresh Tokens
- Integração com PostgreSQL
- Dockerização
- Testes automatizados (Jest)
- Deploy seguro com HTTPS

---

## 👨‍💻 Autor

Luis Botelho  
Estudante de Engenharia de Software  
Foco em Segurança da Informação e Web3

---

⚠️ Projeto educacional desenvolvido para fins de estudo e demonstração técnica.
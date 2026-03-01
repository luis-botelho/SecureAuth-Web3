import { hash as _hash, compare } from 'bcryptjs';

// SGSI: Garantindo a integridade e confidencialidade da senha
const hashPassword = async (password) => {
    const saltRounds = 12; 
    return await _hash(password, saltRounds);
};

const comparePassword = async (password, hash) => {
    return await compare(password, hash);
};

export default { hashPassword, comparePassword };

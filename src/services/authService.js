const userRepository = require('../repositories/userRepository');

const authService = {
  register: async (dados) => {
    const { nome, email, dataNascimento, senha, confirmacaoSenha } = dados;

    if (!nome || !email || !dataNascimento || !senha || !confirmacaoSenha) {
      throw new Error('Todos os campos são obrigatórios.');
    }
    if (senha !== confirmacaoSenha) {
      throw new Error('As senhas não coincidem.');
    }

    const regexSenha = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!regexSenha.test(senha)) {
      throw new Error('A senha deve conter no mínimo 8 caracteres, uma letra maiúscula, um número e um caractere especial.');
    }

    const userExists = await userRepository.findByEmail(email);
    if (userExists) {
      throw new Error('E-mail já cadastrado.');
    }

    return await userRepository.create(nome, email, dataNascimento, senha);
  },

  login: async (email, senha) => {
    const user = await userRepository.findByEmail(email);
    if (!user || user.senha !== senha) {
      throw new Error('Credenciais inválidas.');
    }
    return { nome: user.nome, email: user.email, dataNascimento: user.data_nascimento };
  },

  resetPassword: async (id, novaSenha) => {
    const user = await userRepository.findById(id);
    if (!user) throw new Error('Usuário não encontrado.');
    
    if (user.senha === novaSenha) {
      throw new Error('A nova senha não pode ser igual à senha atual.');
    }

    const regexSenha = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!regexSenha.test(novaSenha)) {
      throw new Error('A nova senha não atende aos requisitos de segurança.');
    }

    await userRepository.updatePassword(id, novaSenha);
  }
};

module.exports = authService;
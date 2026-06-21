const authService = require('../services/authService');

const authController = {
  register: async (req, res) => {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, senha } = req.body;
      const result = await authService.login(email, senha);
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { id, novaSenha } = req.body;
      await authService.resetPassword(id, novaSenha);
      res.status(200).json({ message: 'Senha atualizada com sucesso.' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
};

module.exports = authController;
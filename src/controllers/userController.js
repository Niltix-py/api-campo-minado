const userRepository = require('../repositories/userRepository');
const gameRepository = require('../repositories/gameRepository');

const userController = {
  getProfile: async (req, res) => {
    try {
      const user = await userRepository.findById(req.params.id);
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
      res.status(200).json({
        id: user.id,
        nome: user.nome,
        email: user.email,
        saldo: Number(user.saldo)
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  getDashboard: async (req, res) => {
    try {
      const { idUser } = req.query;
      if (!idUser) return res.status(400).json({ error: 'idUser é obrigatório nos parâmetros de busca (?idUser=...)' });
      const stats = await gameRepository.getDashboardStats(idUser);
      res.status(200).json(stats);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  addSaldo: async (req, res) => {
    try {
      const { id } = req.params;
      const { saldo } = req.body;
      if (saldo < 0) return res.status(400).json({ error: 'Não é permitido cadastrar saldo negativo' });
      
      const user = await userRepository.findById(id);
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

      const novoSaldo = Number((Number(user.saldo) + Number(saldo)).toFixed(2));
      const updated = await userRepository.updateSaldo(id, novoSaldo);
      res.status(200).json({ id: Number(id), saldo: Number(updated.saldo) });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  deleteUser: async (req, res) => {
    try {
      await userRepository.delete(req.params.id);
      res.status(200).json({ message: 'Usuário e jogos deletados com sucesso.' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
};

module.exports = userController;
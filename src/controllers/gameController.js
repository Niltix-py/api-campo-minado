const gameService = require('../services/gameService');

const gameController = {
  start: async (req, res) => {
    try {
      const { idUser, valorAposta } = req.body;
      const result = await gameService.startGame(idUser, Number(valorAposta));
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  reveal: async (req, res) => {
    try {
      const { gameId } = req.params;
      const { linha, coluna } = req.body;
      const result = await gameService.revealPosition(Number(gameId), Number(linha), Number(coluna));
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  cashout: async (req, res) => {
    try {
      const { gameId } = req.params;
      const result = await gameService.cashout(Number(gameId));
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
};

module.exports = gameController;
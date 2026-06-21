const pool = require('../config/database');

const gameRepository = {
  findActiveByUserId: async (userId) => {
    const res = await pool.query('SELECT * FROM games WHERE user_id = $1 AND status = \'EM_ANDAMENTO\'', [userId]);
    return res.rows[0];
  },
  findById: async (gameId) => {
    const res = await pool.query('SELECT * FROM games WHERE id = $1', [gameId]);
    return res.rows[0];
  },
  create: async (userId, valorAposta, tabuleiro) => {
    const res = await pool.query(
      'INSERT INTO games (user_id, valor_aposta, tabuleiro) VALUES ($1, $2, $3) RETURNING id',
      [userId, valorAposta, JSON.stringify(tabuleiro)]
    );
    return res.rows[0];
  },
  updateGameState: async (gameId, posicoesReveladas, quantidadeDiamantes, premioAtual, status) => {
    await pool.query(
      'UPDATE games SET posicoes_reveladas = $1, quantidade_diamantes = $2, premio_atual = $3, status = $4 WHERE id = $5',
      [JSON.stringify(posicoesReveladas), quantidadeDiamantes, premioAtual, status, gameId]
    );
  },
  getDashboardStats: async (userId) => {
    const res = await pool.query(
      `SELECT 
        COUNT(*)::int as "totalJogos",
        COUNT(CASE WHEN status = 'GANHO' THEN 1 END)::int as vitorias,
        COUNT(CASE WHEN status = 'PERDIDO' THEN 1 END)::int as derrotas,
        COALESCE(SUM(CASE WHEN status = 'GANHO' THEN premio_atual - valor_aposta ELSE 0 END), 0)::float as "valorGanho",
        COALESCE(SUM(CASE WHEN status = 'PERDIDO' THEN valor_aposta ELSE 0 END), 0)::float as "valorPerdido"
       FROM games WHERE user_id = $1`,
      [userId]
    );
    return res.rows[0];
  }
};

module.exports = gameRepository;
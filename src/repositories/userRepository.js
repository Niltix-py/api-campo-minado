const pool = require('../config/database');

const userRepository = {
  findByEmail: async (email) => {
    const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return res.rows[0];
  },
  findById: async (id) => {
    const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return res.rows[0];
  },
  create: async (nome, email, dataNascimento, senha) => {
    const res = await pool.query(
      'INSERT INTO users (nome, email, data_nascimento, senha) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, saldo',
      [nome, email, dataNascimento, senha]
    );
    return res.rows[0];
  },
  updatePassword: async (id, novaSenha) => {
    await pool.query('UPDATE users SET senha = $1 WHERE id = $2', [novaSenha, id]);
  },
  updateSaldo: async (id, novoSaldo) => {
    const res = await pool.query('UPDATE users SET saldo = $1 WHERE id = $2 RETURNING saldo', [novoSaldo, id]);
    return res.rows[0];
  },
  delete: async (id) => {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
  }
};

module.exports = userRepository;
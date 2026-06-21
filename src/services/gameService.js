const gameRepository = require('../repositories/gameRepository');
const userRepository = require('../repositories/userRepository');

const gameService = {
  startGame: async (userId, valorAposta) => {
    if (valorAposta <= 0) throw new Error('Valor de aposta inválido.');

    const user = await userRepository.findById(userId);
    if (!user) throw new Error('Usuário não encontrado.');
    if (Number(user.saldo) < valorAposta) throw new Error('Saldo insuficiente.');

    const activeGame = await gameRepository.findActiveByUserId(userId);
    if (activeGame) throw new Error('Você já possui uma partida em andamento.');

    const itens = Array(5).fill('BOMBA').concat(Array(20).fill('DIAMANTE'));
    for (let i = itens.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [itens[i], itens[j]] = [itens[j], itens[i]];
    }

    const tabuleiro = [];
    while (itens.length) tabuleiro.push(itens.splice(0, 5));

    const novoSaldo = Number(user.saldo) - valorAposta;
    await userRepository.updateSaldo(userId, novoSaldo);

    const game = await gameRepository.create(userId, valorAposta, tabuleiro);
    return { gameId: game.id };
  },

  revealPosition: async (gameId, linha, coluna) => {
    const game = await gameRepository.findById(gameId);
    if (!game || game.status !== 'EM_ANDAMENTO') throw new Error('Partida não encontrada ou já finalizada.');

    if (linha < 0 || linha > 4 || coluna < 0 || coluna > 4) {
      throw new Error('Posição inválida no tabuleiro 5x5.');
    }

    const posicoes = game.posicoes_reveladas;
    const jaRevelado = posicoes.some(p => p[0] === linha && p[1] === coluna);
    if (jaRevelado) throw new Error('Esta posição já foi escolhida.');

    posicoes.push([linha, coluna]);
    const elemento = game.tabuleiro[linha][coluna];

    if (elemento === 'BOMBA') {
      await gameRepository.updateGameState(gameId, posicoes, game.quantidade_diamantes, 0, 'PERDIDO');
      return { resultado: 'BOMBA', status: 'PERDIDO' };
    }

    const qtdDiamantes = game.quantidade_diamantes + 1;
    const premio = Number((Number(game.valor_aposta) * (1 + (qtdDiamantes * 0.33))).toFixed(2));

    await gameRepository.updateGameState(gameId, posicoes, qtdDiamantes, premio, 'EM_ANDAMENTO');

    return {
      resultado: 'DIAMANTE',
      diamantesEncontrados: qtdDiamantes,
      premioAtual: premio
    };
  },

  cashout: async (gameId) => {
    const game = await gameRepository.findById(gameId);
    if (!game || game.status !== 'EM_ANDAMENTO') throw new Error('Partida inválida para cashout.');
    if (game.quantidade_diamantes === 0) throw new Error('Você precisa encontrar pelo menos um diamante antes de retirar.');

    await gameRepository.updateGameState(game.id, game.posicoes_reveladas, game.quantidade_diamantes, game.premio_atual, 'GANHO');

    const user = await userRepository.findById(game.user_id);
    const novoSaldo = Number(user.saldo) + Number(game.premio_atual);
    await userRepository.updateSaldo(game.user_id, novoSaldo);

    return { status: 'GANHO', valorSacado: Number(game.premio_atual) };
  }
};

module.exports = gameService;
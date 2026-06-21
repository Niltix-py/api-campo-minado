const express = require('express');
const gameController = require('../controllers/gameController');
const router = express.Router();

router.post('/start', gameController.start);
router.post('/:gameId/reveal', gameController.reveal);
router.post('/:gameId/cashout', gameController.cashout);

module.exports = router;
const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/dashboard', userController.getDashboard);
router.get('/:id', userController.getProfile);
router.put('/:id', userController.addSaldo);
router.delete('/:id', userController.deleteUser);

module.exports = router;
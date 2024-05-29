const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddlewere');

router.use(authMiddleware);
// Rotte per l'autenticazione
router.post('/login', authController.login);

module.exports = router;

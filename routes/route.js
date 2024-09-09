const { Router } = require('express');
const CTRL = require('../controllers/ctrl');

const router = Router();

router.post('/genpass', CTRL.generatepassword);

module.exports = router;
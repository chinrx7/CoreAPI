const { Router } = require('express');
const CTRL = require('../controllers/ctrl');

const router = Router();

router.post('/genpass', CTRL.generatepassword);
router.post('/authen', CTRL.authen);
router.post('/insertlog', CTRL.insertLog);
router.post('/getpoints', CTRL.getPoints);

module.exports = router;
const { Router } = require('express');
const CTRL = require('../controllers/ctrl');

const router = Router();


router.get('/heavy', CTRL.heavyLoad);


router.post('/genpass', CTRL.generatepassword);
router.post('/authen', CTRL.authen);
router.post('/insertlog', CTRL.insertLog);
router.post('/getpoints', CTRL.getPoints);
router.post('/getinterface', CTRL.getInterfaces);
router.post('/getdbs', CTRL.getDBSources);
router.post('/getuser', CTRL.getUser);
router.post('/getusergroup', CTRL.getUserGroup);

router.post('/checktrust', CTRL.checkTrust);
router.post('/writedata', CTRL.WriteData);

module.exports = router;
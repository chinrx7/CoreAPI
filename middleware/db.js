const { connectMsgDB, getDBMsg } = require('./dbMsg');
const { connectCfgDB, getDBCfg } = require('./dbC');
const logger = require('./log');

let dbC, dbMsg;

connectCfgDB(async (err) => {
    if(!err){
        dbC = await getDBCfg();
        exports.dbC = dbC;
        logger.loginfo('DB Configures', 'Connected to database', 'Info');
    }
    else{
        logger.loginfo('DB Configures', err, 'Error');
    }
});

connectMsgDB((err) => {
    if(!err){
        dbMsg = getDBMsg();
        exports.dbMsg = dbMsg;
        logger.loginfo('DB Message', 'Connected to database', 'Info');
    }
    else{
        logger.loginfo('DB Message', err, 'Error');
    }
});

console.log(dbC)
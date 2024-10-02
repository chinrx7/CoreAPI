const { MongoClient } = require('mongodb');
const { config } = require('./config');
const logger = require('./log');

//const authMechanism = '?authMechanism=DEFAULT';
const dbUrl = config.DB + 'Configures'

let dbCfgCon;

module.exports = {
      connectCfgDB: async (cb) => {
        if (dbCfgCon) {
            return cb();
        }
        else {
            await MongoClient.connect(dbUrl)
                .then((client) => {
                    dbCfgCon = client.db()
                    //logger.loginfo('DB Configures', 'Connected', 'Info');
                    return cb()
                })
                .catch(err => {
                    logger.loginfo('DBConfigure', err, 'Error');
                    return cb(err)
                })
        }
    },
    getDBCfg: () => dbCfgCon
}
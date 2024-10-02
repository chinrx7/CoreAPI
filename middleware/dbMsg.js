const { MongoClient } = require('mongodb');
const { config } = require('./config');
const logger = require('./log');

//const authMechanism = '?authMechanism=DEFAULT';
const dbUrl = config.DB + 'Logs'

let dbMsgCon;

module.exports = {
    connectMsgDB: (cb) => {
        if(dbMsgCon){
            return cb();
        }
        MongoClient.connect(dbUrl)
        .then((client) => {
            dbMsgCon = client.db()
            //logger.loginfo('DB Message', 'Connected','Info');
            return cb()
        })
        .catch(err =>{
            logger.loginfo('DB Message', err, 'Error');
            return cb(err)
        })
    },
    getDBMsg:() => dbMsgCon
}
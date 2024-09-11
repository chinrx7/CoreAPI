const { MongoClient } = require('mongodb');
const { config } = require('./config');
const logger = require('./log');

//const authMechanism = '?authMechanism=DEFAULT';
const dbUrl = config.DB + 'Logs'

let dbMsgCon;

module.exports = {
    connectMsgDB: (cb) => {
        MongoClient.connect(dbUrl)
        .then((client) => {
            dbMsgCon = client.db()
            return cb()
        })
        .catch(err =>{
            logger.loginfo('DBMessage', err, 'Error');
            return cb(err)
        })
    },
    getDBMsg:() => dbMsgCon
}
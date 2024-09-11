const mosca = require('mosca');
const logger = require('./log');
const { mqttConfig } = require('./config');

const mqttServer = new mosca.Server(mqttConfig);

mqttServer.on('ready', setup);

setup = () =>{
    mqttServer.authenticate = authen;
    logger.loginfo('Mqtt server is up')
}

const authen = (client, username, password, callback) => {

}
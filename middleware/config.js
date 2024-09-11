const fs = require('fs');

const config = JSON.parse(fs.readFileSync('./config/config.json', 'utf8'));

const mqttConfig = JSON.parse(fs.readFileSync('./config/mqtt.json', 'utf8'));

exports.config = config;
exports.mqttConfig = mqttConfig;
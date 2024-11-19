const express = require('express');
const cors = require('cors');
const cluster = require('cluster');
const os = require('os');
const path = require('path');
const routes = require('./routes/route');
const logger = require('./middleware/log');
const compression = require('compression');
const https = require('https');
const fs = require('fs');

const { config } = require('./middleware/config');

const numCPUs = os.cpus().length;


const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '100mb' }));
app.use(cors({ origin: '*', credentials: true }));
app.use(compression());

const Port = config.PORT || 4123;
const Ports = config.PORTS || 443;

const key = fs.readFileSync('./cer/selfsigned.key');
const cert = fs.readFileSync('./cer/selfsigned.crt');
const options = {
    key: key,
    cert: cert
}

app.use(routes);

const servers = https.createServer(options, app);

let nThread=0;

if (cluster.isMaster) {
    logger.loginfo('CoreAPI', `Master process ${process.pid} is running at port: ${Port}`,'Info');

    let CThread = config.NThread;

    if (CThread !== 0) {
    
        if (config.NThread > numCPUs) {
            CThread = numCPUs;
        }
        for (let i = 0; i < CThread; i++) {
            cluster.fork();
            nThread++;
        }
        logger.loginfo('CoreAPI', `Running with number of thread : ${nThread}`,'Info');

    }
} else {
    app.listen(Port, () => {
        logger.loginfo('CoreAPI', `Started and listen at port: ${Port} and Process ID: ${process.pid}`, 'Info');
    });

    servers.listen(Ports, () => {
        logger.loginfo('CoreAPI', `Hppts Listen at port: ${Ports}`);
    })
} 
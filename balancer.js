
const { dirname } = require('path');
const { fileURLToPath } = require('url');
const cluster = require('node:cluster');
const cpuCount = require('node:os').availableParallelism();
const process = require('node:process');

const __dirname = dirname(fileURLToPath(import.meta.url));

cluster.setupPrimary({
    exec: __dirname + "app.js",
})

if (cluster.isPrimary) {

    console.log(`Primary ${process.pid} is running`)

    for (let i = 0; i < cpuCount; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
    });
} else {
    
}
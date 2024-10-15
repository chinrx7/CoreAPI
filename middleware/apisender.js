const axios = require('axios');
const { Worker, parentPort, workerData } = require('worker_threads');
const logger = require('./log');


let ActiveUrl;

parentPort.on('message', async (Param) => {
    await chekPrimary(Param[0])
    //console.log(ActiveUrl)
    await sendRequest(Param[1]);
    //parentPort.postMessage('request received')
})

chekPrimary = async (Addrs) => {
    try {

        const route = '/api/data/gethealth'
        if (await SendGet(Addrs.Primary + route) === 'OK') {
            //console.log('Primary')
            ActiveUrl = Addrs.Primary;
        }
        else if (await SendGet(Addrs.Secondary + route) === 'OK') {
            //console.log('Secondary')
            ActiveUrl = Addrs.Secondary;
        }
        else {
            ActiveUrl = '0';
        }
    }
    catch (err) {
        logger.loginfo('CoreAPI', err, 'Error');
    }
}

sendRequest = async (reqs) => {
    try {
        const route = '/api/data/write';

        await axios.post(ActiveUrl + route, reqs)
            .then((res) => {
                parentPort.postMessage(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
        //parentPort.postMessage('ok')
    }
    catch (err) {
        parentPort.postMessage(err)
    }
}

SendGet = async (url) => {
    let result;
    try {
        await axios.get(url, { timeout: 100 })
            .then((res) => {
                result = res.data
            })
            .catch((err) => {
                console.log(err);
            });
    }
    catch (err) {
        // console.log(err);
    }
    return result
}
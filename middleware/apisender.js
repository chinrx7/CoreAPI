const axios = require('axios');
const { Worker, parentPort, workerData } = require('worker_threads');


parentPort.on('message', async (req) => {
      await sendRequest(req);
    //parentPort.postMessage('request received')
})

sendRequest = async (reqs) => {
    try{
     await axios.post('http://192.168.9.103:6060/api/data/write', reqs)
        .then((res) => {
            parentPort.postMessage(res.data);
        });
        //parentPort.postMessage('ok')
    }
    catch(err){
        parentPort.postMessage(err)
    }
}
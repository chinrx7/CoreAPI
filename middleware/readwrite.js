const axios = require('axios');
const configure = require('./configures');
const os = require('os');
const ip = require('ip');
const logger = require('./log');
const { Worker, isMainThread, parentPort, workerData }= require('worker_threads');

const sender = new Worker('./middleware/apisender.js');

const query = require('./QuerydbC');

let DBs, HostInfo;

let WriteBuffer = [];


(async () => {
    DBs = await query.Query('DBSources', {});
    await getHostInfo();
})();

sender.on('message', (msg) => {
    console.log(msg)
})

module.exports.WriteDBI = async (request) => {
    const Dest = getDBfromPS(request.Headers.PS);
    if (Dest) {
        const points = request.Points;

        const req = { HostInfo, "Headers": request.Headers, "Points": points }

        // for (let i=0;i<1000;i++){
        //     await sendWriteReq(req);
        // }
   

        await sendWriteReq(req);
    }
}

saveWritetoQ = (req) => {
    WriteBuffer.push(req);
    //console.log('Write in Q : ' + WriteBuffer.length)
    if(WriteBuffer.length === 10){
        sendWriteReq();
        WriteBuffer = [];
    }
}

sendWriteReq = async (req) => {
    sender.postMessage(req)
    // await axios.post('http://192.168.9.103:6060/api/data/write', req)
    //     .then((res) => {
    //         console.log(res.data)
    //     })
}

getHostInfo = () => {
    const hostName = os.hostname();
    let IPs = [];

    const nts = os.networkInterfaces();

    for (let n in nts){
        const iface = nts[n];
        iface.forEach(i => {
            //console.log(i.family)
            if(i.family === 'IPv4'){
                IPs.push(i.address)
            }
        })
    }

    IPs = IPs.filter(v => v !== '127.0.0.1');

    HostInfo = { "MachineName" : hostName , "IPAddress" : IPs};
}


getDBfromPS = (PS) => {
    let Sdb;
    DBs.forEach(db => {
        db.PointSources.forEach(s => {
            //console.log(s);
            if (s === PS) {
                //console.log(db)
                Sdb = db;
            }
        })
    });

    return Sdb;
}

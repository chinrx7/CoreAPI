const axios = require('axios');
const configure = require('./configures');
const os = require('os');
const ip = require('ip');
const logger = require('./log');
const points = require('./points');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const rapi = require('./axios');

const sender = new Worker('./middleware/apisender.js');

const query = require('./QuerydbC');

let DBs, HostInfo, ActiveUrl;

let WriteBuffer = [];

let senderMsg = { StatusCode: 'OK', Message: 'Send data successfully' };


(async () => {
    DBs = await query.Query('DBSources', {});
    await getHostInfo();

    //console.log(DBs)
})();

sender.on('message', (msg) => {
    //console.log(msg);
    senderMsg = msg;
});


module.exports.WriteDBI = async (request) => {
    const Dest = getDBfromPS(request.Headers.PS);
    if (Dest) {
        const points = request.Points;

        const req = { HostInfo, "Headers": request.Headers, "Points": points }

        await sendWriteReq(Dest,req);
    }
    return senderMsg;
}

module.exports.ReadDBI = async (request) => {
    let results = [];
    const tranformed = await points.groupByPS(request.Points, request.Options);
    for await (let tr of tranformed) {
        const Dest = getDBfromPS(tr.PS);
        const Primary = await CheckPrimary(Dest.Address);
        // console.log(Primary);
        // console.log(tr)
        const result = await readApi(Primary, tr);

        result.forEach(rs => {
            results.push(rs);
        })

    }
    return points.tranfromResponse(results);
}

readApi = async (ip,request) => {
    const url = `http://${ip}/api/data/read`;

    let dr = [];
    dr.push(request)

    const res = await rapi.sendPostReq(url, dr);

    if(res){
        return res;
    }

}

module.exports.ReadDBIXX = async (request) => {
    //await this.ReadDBI2(request)
    await points.groupByPS(request.Points, request.Options);
    const pid = await points.getPointID(request.Points);
    const freq = { Points: pid, Options: request.Options }
    let freqs =[];
    freqs.push(freq);
    const url = 'http://192.168.9.103:6060/api/data/read';
    const result = await rapi.sendPostReq(url, freqs);
    return result;
}

CheckPrimary = async (Addrs) => {
    //console.log(Addrs)
    let ActiveUrl;
    try {
        const route = '/api/data/gethealth'
        if (await rapi.SendGet('http://' + Addrs.Primary + route, 100) === 'OK') {
            //console.log('Primary')
            ActiveUrl = Addrs.Primary;
        }
        else if (await rapi.SendGet('http://' + Addrs.Secondary + route, 100) === 'OK') {
            //console.log('Secondary')
            ActiveUrl = Addrs.Secondary;
        }
        else {
            ActiveUrl = '0';
        }
    }
    catch (err) {
        //logger.loginfo('CoreAPI', err, 'Error');
    }

    return ActiveUrl;
}

sendPostReq = async (url, request) => {
    let result;
    await axios.post(url, request)
        .then((res) => {
            if(res){
                result = res.data;
            }
        })
        .catch((err) => {
            console.log(err)
        })

    return result;
}

saveWritetoQ = (req) => {
    WriteBuffer.push(req);
    //console.log('Write in Q : ' + WriteBuffer.length)
    if (WriteBuffer.length === 10) {
        sendWriteReq();
        WriteBuffer = [];
    }
}

sendWriteReq = async (Dest,req) => {
    const rWrite = '/api/data/write'

    const apiUrl = { Primary: `http://${Dest.Address.Primary}`, Secondary: `http://${Dest.Address.Secondary}` };

    let PassParam = [];
    PassParam.push(apiUrl);
    PassParam.push(req);

    sender.postMessage(PassParam)
}

getHostInfo = () => {
    const hostName = os.hostname();
    let IPs = [];

    const nts = os.networkInterfaces();

    for (let n in nts) {
        const iface = nts[n];
        iface.forEach(i => {
            //console.log(i.family)
            if (i.family === 'IPv4') {
                IPs.push(i.address)
            }
        })
    }

    IPs = IPs.filter(v => v !== '127.0.0.1');

    HostInfo = { "MachineName": hostName, "IPAddress": IPs };
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

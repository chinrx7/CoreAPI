const query = require('./QuerydbC');


let Points = [];

LoadPoint = async () => {
    const qs = await query.Query('Points', {});
    for await (let q of qs) {
        Points.push(q);
    }
}

(async() => {
    await LoadPoint();
})();

module.exports.getPointID = async (PTName) => {
    let res = [];
    PTName.forEach(p => {
        let pid = Points.find(ps => ps.Name === p);
        if(pid){
            res.push(pid.TagID);
        }
    });
    return res;
}

module.exports.groupByPS = async (PTNameS, Options) => {
    let res = [];
    PTNameS.forEach(p => {
        let ps = Points.find(pts => pts.Name === p);
        if (ps) {
            const tranP = { ID: ps.TagID, Name: ps.Name, PS: ps.PointSource };
            res.push(tranP)
        }
    })

    let grpByPS = [];

    res.forEach(r => {
        let exist = grpByPS.findIndex(g => g.PS === r.PS);
        if(exist === -1){
            grpByPS.push({ PS: r.PS, Points:[r.ID], Options: Options})
        }
        else{
            let idx = grpByPS.findIndex(gb => gb.PS === r.PS);
            grpByPS[idx].Points.push(r.ID)
           // grpByPS.PS[0].Points.push(r.ID)
        }
    })

    return grpByPS;
}

module.exports.tranfromResponse = (response) => {
    response.forEach(rep => {
        const p = Points.find(ps => ps.TagID === rep.Point);
        rep.Point = p.Name
    });

    return response;
}
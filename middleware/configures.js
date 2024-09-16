const { connectCfgDB, getDBCfg } = require('./dbC');
const logger = require('./log');

let dbC;

const PCname = 'Points';
const INTCname = 'Interfaces';
const DBCname = 'DBSources';

connectCfgDB((err) => {
    if (!err) {
        dbC = getDBCfg();
    }
})

module.exports.getTagConfig = async (InterfaceID, PointSource) => {
    let res;
    const Query = { InterfaceID: InterfaceID, PointSource: PointSource };

    res = await queryDB(PCname, Query)


    if (res) {
        return res;
    }
    else {
        res = 'Point not found!';
    }
}

module.exports.getInterfaces = async (InterfaceID, PointSource) => {
    let res;
    const Query = { ID : InterfaceID, PointSource:PointSource }

    res = await queryDB(INTCname, Query);

    if(res) {
        return res;
    }
    else{
        res = 'Interface setting not found!'
    }
}

module.exports.getDBS = async () => {
    let res;
    const Query ={};

    res = await queryDB(DBCname, Query);

    if(res) {
        return res;
    }
    else{
        res = 'Database source not found';
    }
}

queryDB = async (CName, Query) => {
    try {
        let res = [];
        const cols = dbC.collection(CName);
        const options = { projection: { _id: 0 } };

        let tags;
        tags = await cols.find(Query, options);
        for await (t of tags) {
            res.push(t);
        }

        return res;
    }
    catch (err) {
        logger.loginfo('Configure', err, 'Error');
    }
}
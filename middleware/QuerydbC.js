const { connectCfgDB, getDBCfg } = require('./dbC')
const logger = require('./log');

let dbC;

module.exports.QueryOne = async (colName, Query) => {
    let res;
    try {
        if (!dbC) {
            await connectCfgDB((err) => {
                if (!err) {
                    dbC = getDBCfg();
                }
            })
        }
        const col = dbC.collection(colName);
        const options = { projection: { _id: 0 } };
        res = await col.findOne(Query, options);
    }
    catch (err) {
        console.log(err);
    }
    return res;
}

module.exports.Query = async (colName, Query) => {
    if (!dbC) {
        await connectCfgDB((err) => {
            if (!err) {
                dbC = getDBCfg();
            }
        })
    }
    let res = [];
    try {
        const col = dbC.collection(colName);
        const options = { projection: { _id: 0 } };
        const qres = await col.find(Query,options);

        for await (q of qres) {
            res.push(q);
        }
    }
    catch (err) {
        console.log(err);
    }

    return res;
}

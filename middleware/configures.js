const { connectCfgDB, getDBCfg } = require('./dbC');
const logger = require('./log');

let dbC;

connectCfgDB((err) => {
    if(!err){
        dbC = getDBCfg();
    }
});

module.exports.getTagConfig = async (InterfaceID, PointSource) => {

    //console.log(dbC)
    let res;
    const CName = 'Points';
    const Query = { InterfaceID: InterfaceID, PointSource: PointSource };

    res = await queryDB(CName,Query)


    if(res){
        return res;
    }
    else{
        res = 'Point not found!';
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
const query = require('./QuerydbC');
const logger = require('./log');

const PCname = 'Points';
const INTCname = 'Interfaces';
const DBCname = 'DBSources';
const UCname = 'Users';
const UGCname = 'UserGroups';



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
        res = 'Database source not found!';
    }
}

module.exports.getUsers = async (user) => {
    let res;

    let Query = {};
    if (user) {
        Query = { Username: user }
    }

    res= await queryDB(UCname, Query)

    if(res) {
        return res;
    }
    else{
        res = 'User not found!';
    }
}

module.exports.getUserGroup = async (user) => {
    let res;

    let Query = { Username: user };
    const Udetial = await queryDB(UCname, Query);
    const Ugrp = Udetial[0].Group;

    Query = { Name: Ugrp }

    res = await queryDB(UGCname, Query);
    if(res) {
        return res;
    }
    else{
        res = 'User group not found!';
    }
}

queryDB = async (CName, Query) => {
    try {
        let res = [];

        let tags;
        tags = await query.Query(CName, Query)
        for await (t of tags) {
            res.push(t);
        }

        return res;
    }
    catch (err) {
        logger.loginfo('Configure', err, 'Error');
    }
}
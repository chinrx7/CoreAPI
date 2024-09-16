const util = require('./utilitys');
const { dbMsg } = require('./db');

module.exports.InsertMessage = async (msgs) => {
    const DateN = new Date();
    const colName = 'Log_' + DateN.getFullYear() + '_' + util.padMon(DateN.getMonth() + 1);

    const cols = dbMsg.collection(colName);

    await cols.insertMany(msgs)

}
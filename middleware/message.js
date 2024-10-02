const util = require('./utilitys');
const { connectMsgDB, getDBMsg } = require('./dbMsg');

let dbMsg;

connectMsgDB((err) => {
    if (!err) {
        dbMsg = getDBMsg();
    }
}
)

module.exports.InsertMessage = async (msgs) => {
    const DateN = new Date();
    const colName = 'Log_' + DateN.getFullYear() + '_' + util.padMon(DateN.getMonth() + 1);

    const cols = dbMsg.collection(colName);

    await cols.insertMany(msgs)

}
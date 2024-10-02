const { MongoClient } =  require('mongodb');
const { config } = require('../config');

const dbUrl = config.DB + 'Configures';

function dbcon() {
    const mongoclient = new MongoClient(dbUrl,{
        connectTimeoutMS: 30000
    });

    async function dbConfig() {
        try{
            await mongoclient.connect();
            return mongoclient.db();
        }
        catch(err){
            console.error(err);
        }
        finally{
            await mongoclient.close();
        }
    }

    return {
        dbConfig
    };
}

module.exports = dbcon();
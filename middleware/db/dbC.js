const { MongoClient } = require('mongodb');
const { config } = require('../config');

let dbC;

const initdbC = callback => {
    if (dbC) {
        return callback(null, dbC);
    }
   
}
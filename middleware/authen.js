const bcrypt = require('bcrypt');
const { config } = require('./config');
const jwt = require('jsonwebtoken');
const { connectCfgDB, getDBCfg } = require('./dbC');
const logger = require('./log');

let dbC;

connectCfgDB((err) => {
    if(!err){
        dbC = getDBCfg();
    }
})

module.exports.genPass = async (pwd) => {
    const salt = await bcrypt.genSalt();
    const enpass = await bcrypt.hash(pwd,salt);

    return enpass;
}

module.exports.Authen = async (user, password) => {
    try {
        const users = dbC.collection('Users');
        const exist = await users.findOne({ Username: user });

        if (exist) {
            const auth = await bcrypt.compare(password, exist.Password);
            if (auth) {
                return GenToken(exist);
            }
        }
    }
    catch (err) {
        
    }
}

const GenToken = (user) => {
    const accessToken  = jwt.sign(
        {
            UserName: user.Username,
            _id: user._id
        },
        config.Secret,
        {
            expiresIn: config.SYSTEM_TOKEN_TIME, algorithm: "HS256"
        }
    )

    return accessToken;
}

module.exports.ValidateToken = (token) => {
    let res;
    jwt.verify(token, config.Secret, (err, decode) => {
        if(!err){
            res = true;
        }
        else{
            res = false;
        }
    });

    return res;
}

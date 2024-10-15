const bcrypt = require('bcrypt');
const { config } = require('./config');
const jwt = require('jsonwebtoken');
const { connectCfgDB, getDBCfg } = require('./dbC');
const logger = require('./log');

const query = require('./QuerydbC');

let dbC;

connectCfgDB((err) => {
    if (!err) {
        dbC = getDBCfg();
    }
})

module.exports.genPass = async (pwd) => {
    const salt = await bcrypt.genSalt();
    const enpass = await bcrypt.hash(pwd, salt);

    return enpass;
}

module.exports.Authen = async (user, password) => {
    let res = 0;
    try {

        const exist = await query.QueryOne('Users', { Username: user});

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
    const accessToken = jwt.sign(
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
        if (!err) {
            res = true;
        }
        else {
            res = false;
        }
    });

    return res;
}


module.exports.CheckInterface = async (hosts) => {

    let res =0;
    try {
        let ints = [];
        const interfaces = await query.Query('Trusts', {})
        for await (i of interfaces) {
            ints.push(i);
        }

        ints.forEach(i => {
            if (i.Host === hosts.MachineName) {
                res =1;
                let n = 0;
                i.IPAddress.forEach(ip => {
                    if(ip === hosts.IPAddress[n]){
                        res =1;
                    }
                    n++;
                })
            }
        })

        return res;

        //console.log(ints);
    }
    catch (err) {
        return res;
        logger.loginfo('Auhten', err, 'Error');
    }
}
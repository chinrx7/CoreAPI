const msg = require('../middleware/message');
const auth = require('../middleware/authen');
const cfg = require('../middleware/configures');
const rw = require('../middleware/readwrite');
const pt = require('../middleware/points');

module.exports.generatepassword = async (req, res) => {
    if (req.body) {
        const { password } = req.body;
        const enpass = await auth.genPass(password);
        res.status(200).json(enpass);
    }
    else {
        res.status(204).json('Invalid request!');
    }
}

module.exports.authen = async (req, res) => {
    if (req.body) {
        const { username, password } = req.body;
        //console.log(username, password)
        const Token = await auth.Authen(username, password);
        if (Token) {
            res.status(200).json({ Access: { Token: Token } });
        }
        else {
            res.status(403).json('username or password incorrect!');
        }
    }
    else {
        res.status(204).json('Invalid request!');
    }
}

module.exports.insertLog = async (req, res) => {
    if (req.body) {
        const token = req.headers["authorization"];
        const { Host } = req.body;
        if (auth.ValidateToken(token) || auth.CheckInterface(Host)) {
            msg.InsertMessage(req.body)
            res.status(200).json('ok')
        }
        else {
            res.status(403).json('Invalid Token!')
        }
    }
    else {
        res.status(204).json('Invalid request!');
    }
}

module.exports.getPoints = async (req, res) => {
    if (req.body) {
        const token = req.headers["authorization"];
        const { Host } = req.body;
        if (auth.ValidateToken(token) || await auth.CheckInterface(Host)) {
            const { InterfaceId, PointSource } = req.body;
            const result = await cfg.getTagConfig(InterfaceId, PointSource);
            if (result) {
                res.status(200).json(result);
            }
            else {
                res.status(200).json('No Points found!')
            }
        }
        else {
            res.status(403).json('Invalid Token!')
        }
    }
    else {
        res.status(204).json('Invalid request!');
    }
}

module.exports.read = async (req, res) => {
    if(req.body){
        const token = req.headers["authorization"];
        const { Host, Request } = req.body;

        if (auth.ValidateToken(token) || await auth.CheckInterface(Host)) {
            const result = await rw.ReadDBI(Request)
            if(result){
                res.status(200).json(result)
            }
        }
    }
}

module.exports.getPointID = async (req, res) => {
    if(req.body){
        const token = req.headers["authorization"];
        const { Host, Request } = req.body;

        if (auth.ValidateToken(token) || await auth.CheckInterface(Host)) {

            const result = await pt.getPointID(Request.Points);
            const forwardReq = { Points:result, Options: Request.Options }
            console.log(forwardReq)
            res.status(200).json('ok')
        }
    }
}

module.exports.getInterfaces = async (req, res) => {
    if (req.body) {
        const token = req.headers["authorization"];
        const { Host } = req.body;
        if (auth.ValidateToken(token) || auth.CheckInterface(Host)) {
            const { InterfaceId, PointSource } = req.body;
            const result = await cfg.getInterfaces(InterfaceId, PointSource);
            if (result) {
                res.status(200).json(result);
            }
            else {
                res.status(200).json('No interface setting found!')
            }
        }
        else {
            res.status(403).json('Invalid Token!')
        }
    }
    else {
        res.status(204).json('Invalid request!')
    }
}

module.exports.getDBSources = async (req, res) => {
    if (req.body) {
        const token = req.headers["authorization"];
        const { Host } = req.body;
        if (auth.ValidateToken(token) || auth.CheckInterface(Host)) {
            const result = await cfg.getDBS();
            if (result) {
                res.status(200).json(result);
            }
            else {
                res.status(200).json('No database setting found!')
            }
        }
        else {
            res.status(403).json('Invalid Token!')
        }
    }
    else {
        res.status(204).json('Invalid request!')
    }
}

module.exports.getUser = async (req, res) => {
    if (req.body) {
        const token = req.headers["authorization"];
        const { Host } = req.body;
        if (auth.ValidateToken(token) || auth.CheckInterface(Host)) {
            const { username } = req.body;
            const result = await cfg.getUsers(username);
            if (result) {
                res.status(200).json(result);
            }
            else {
                res.status(200).json('No user found!')
            }
        }
        else {
            res.status(403).json('Invalid Token!')
        }
    }
    else {
        res.status(204).json('Invalid request!')
    }
}

module.exports.getUserGroup = async (req, res) => {
    if (req.body) {
        const token = req.headers["authorization"];
        const { Host } = req.body;
        if (auth.ValidateToken(token) || auth.CheckInterface(Host)) {
            const { username } = req.body;
            const result = await cfg.getUserGroup(username);
            if (result) {
                res.status(200).json(result);
            }
            else {
                res.status(200).json('No user group found!')
            }
        }
        else {
            res.status(403).json('Invalid Token!')
        }
    }
    else {
        res.status(204).json('Invalid request!')
    }
}

module.exports.heavyLoad = async (req, res) => {
    //console.log('get heavy')
    let total = 0;
    for (let i = 0; i < 50_000_000; i++) {
        total++;
    }
    res.status(200).json(`CPU intensive task is ${total}`);
}

module.exports.getHealth = async (req,res) => {
    res.status(200).json('ok');
}

module.exports.checkTrust = async (req, res) => {
    const host = req.body;

    const trust = await auth.CheckInterface(host);
    console.log(trust)

    res.status(200).json('ok');
}

module.exports.WriteData = async (req, res) => {
    if(req.body){
        const token = req.headers["authorization"];
        const { Host } = req.body;
        if (auth.ValidateToken(token) || auth.CheckInterface(Host)) {
            const msg = await rw.WriteDBI(req.body);

            res.status(200).json(msg);
        }
        else {
            res.status(403).json('Invalid Token!')
        }
    }
    else {
        res.status(204).json('Invalid request!')
    }
}
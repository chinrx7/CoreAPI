const msg = require('../middleware/message');
const auth = require('../middleware/authen');
const cfg = require('../middleware/configures');

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
        if (auth.ValidateToken(token)) {
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
        if (auth.ValidateToken(token)) {
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
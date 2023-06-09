
const auth = require('basic-auth');
const compare = require('tsscmp');

const basicAuth = (req, res, next) => {
    const credentials = auth(req);
    if(credentials && check(credentials.name, credentials.pass)) {
        return next();
    }
    res.set('WWW-Authenticate', 'Basic realm="required"');
    return res.status(401).send("Unauthorized");
}

const check = (name, pass) => {
    let valid = true; 
    valid = compare(name, 'admin') && valid;
    valid = compare(pass, 'meowmix') && valid;
    return valid;
}

module.exports = basicAuth; //
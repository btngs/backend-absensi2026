const logRequest = (req, res, next) => {
    console.log('request from', req.path);
    next();
}

module.exports = logRequest;
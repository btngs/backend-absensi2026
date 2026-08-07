const logRequest = (req, res, next) => {
    console.log('request from', req.path);
    next();
}

// const userLoggedin = (req, res, next) => {
//     if (req.user) {
//         console.log('user logged in:', req.user);
//     } else {
//         console.log('no user logged in');
//     }
//     next();
// };

module.exports = {
    logRequest
    // userLoggedin
};
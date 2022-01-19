const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser")

function authenticateToken(req, res, next) {
    const token = req.cookies.access_token;

    console.log("oho",token);

    if (!token) return res.sendStatus(403);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, login) => {
        if (err) return res.sendStatus(403);
        req.login = login.login;
        return next();
    });
}

module.exports = authenticateToken;

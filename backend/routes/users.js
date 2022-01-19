const router = require("express").Router();
let Users = require("../models/users.model");
const bcryp = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../utilities/authenticateToken");
const cookieParser = require("cookie-parser");

router.route("/").get(authenticateToken, (req, res) => {
    Users.findOne({ login: req.login })
        .then((users) => {
            res.json(users);
        })
        .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/register").post(async (req, res) => {
    const users = await Users.findOne({ login: req.body.login });
    if (users !== null) {
        return res.status(400).send("User with this login already exists!");
    } else {
        const password = await bcryp.hash(req.body.password, 10);
        const login = req.body.login;

        const newUsers = await new Users({
            login,
            password,
        });

        newUsers
            .save()
            .then(() => res.json("User added"))
            .catch((err) => res.status(400).json("Error: " + err));
    }
});

router.route("/login").post(async (req, res) => {
    Users.findOne({ login: req.body.login })
        .then((user) => {
            if (user === null) {
                res.status(400).send("Cannot find user");
                return false;
            }
            console.log(user.password);
            console.log(req.body.password);
            if (bcryp.compareSync(req.body.password, user.password)) {
                return true;
            } else {
                res.send("Not allowed");
                return false;
            }
        })
        .then((isProceed) => {
            if (!isProceed) {
                return;
            }
            const login = { login: req.body.login };
            const accessToken = jwt.sign(login, process.env.ACCESS_TOKEN_SECRET);
            console.log(accessToken);
            return res
                .cookie("access_token", accessToken, {
                    httpOnly: true,
                })
                .status(200)
                .json({ message: "Logged in successfully 😊 👌" });
        })
        .catch((err) => res.status(500).json("Error: " + err));

    router.route("/logout").get(authenticateToken, (req, res) => {
        return res
            .clearCookie("access_token")
            .status(200)
            .json({ message: "Successfully logged out 😏 🍀" });
    });
});

module.exports = router;

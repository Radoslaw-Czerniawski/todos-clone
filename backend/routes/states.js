const router = require("express").Router();
const authenticateToken = require("../utilities/authenticateToken");
let States = require("../models/states.model");

router.route("/").get(authenticateToken,(req, res) => {
    console.log(req.login);
    States.find({login: req.login})
        .then((states) => {
            console.log(states);
            res.json(states)
        })
        .catch((err) => res.status(400).json("Error: " + err));
});


router.route('/add').post(authenticateToken,(req, res) => {
    const length = req.body.length;
    const currentlyRendering = req.body.currentlyRendering
    const login = req.body.login

    const newStates = new States({
        length,
        currentlyRendering,
        login,
    });

    newStates.save()
        .then(() => res.json('State added'))
        .catch((err) => res.status(400).json("Error: " + err));
})

router.route('/update').patch(authenticateToken,(req, res) => {
    States.find({login: req.login})
    .then(state => {
        console.log(state);
        state[0].length = req.body.length;
        state[0].currentlyRendering = req.body.currentlyRendering;
        state[0].login = req.body.login

        state[0].save()
        .then(() => res.json("State updated"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch(err => err.status(400).json("Error: " + err))
})

module.exports = router;

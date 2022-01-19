const router = require("express").Router();
const authenticateToken = require("../utilities/authenticateToken")
let Notes = require("../models/notes.model");

router.route("/").get(authenticateToken, (req, res) => {
    Notes.find({login: req.login})
        .then((notes) => {
            console.log(req.login);
            res.json(notes)
        })
        .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get(authenticateToken, (req, res) => {
    Notes.findById(req.params.id)
        .then((note) => res.json(note))
        .catch((err) => res.status(400).json("Error: " + err));
});

router.route('/add').post(authenticateToken,(req, res) => {
    const text = req.body.text;
    const isActive = req.body.isActive;
    const _id = req.body._id;
    const login = req.body.login;

    const newNote = new Notes({
        text,
        isActive,
        _id,
        login
    });

    newNote.save()
        .then(() => res.json('Note added'))
        .catch((err) => res.status(400).json("Error: " + err));
})

router.route('/:id').delete(authenticateToken,(req, res) => {
    Notes.findByIdAndDelete(req.params.id)
    .then(() => res.json("Note deleted"))
    .catch(err => err.status(400).json("Error: " + err))
})

router.route('/update/:id').patch(authenticateToken,(req, res) => {
    Notes.findById(req.params.id)
    .then(state => {
        state.text = req.body.text;
        state.isActive = req.body.isActive;

        state.save()
        .then(() => res.json("Notes updated"))
        .catch(err => err.status(400).json("Error: " + err))
    })
    .catch(err => console.log(err))
})


module.exports = router;

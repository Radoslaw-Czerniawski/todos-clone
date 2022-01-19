const express = require("express");
const cors = require("cors");
const bcryp = require("bcrypt");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const users = [{ name: "Kyle", password: "password" }];

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const URI = process.env.ATLAS_URI;
mongoose.connect(URI);
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
});

app.use("/notes", require("./routes/notes"));
app.use("/states", require("./routes/states"));
app.use("/users", require("./routes/users"));


app.listen(port, () => {
    console.log("Server is running on port:", port);
});

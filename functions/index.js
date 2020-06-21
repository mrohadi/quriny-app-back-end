const functions = require("firebase-functions");
const app = require("express")();
const firebase = require("firebase");
const { getAllScreams, postOneScream } = require("./handlers/screams");
const { signup, login } = require("./handlers/users");
const FBauth = require("./util/fbAuth");

// Screams Route
app.get("/screams", getAllScreams);
app.post("/scream", FBauth, postOneScream);
// Users Route
app.post("/signup", signup);
app.post("/login", login);

// https://baseurl.com/api/
exports.api = functions.region("asia-east2").https.onRequest(app);

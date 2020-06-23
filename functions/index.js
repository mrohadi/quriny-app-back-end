const functions = require("firebase-functions");
const app = require("express")();
const FBauth = require("./util/fbAuth");
const {
  getAllScreams,
  postOneScream,
  getScream,
  commentOnScream,
} = require("./handlers/screams");
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
} = require("./handlers/users");

// Screams Route
app.get("/screams", getAllScreams);
app.post("/scream", FBauth, postOneScream);
app.get("/scream/:screamId", getScream);
// TODO delete scream
// TODO like a scream
// TODO unlike a scream
app.post("/scream/:screamId/comment", FBauth, commentOnScream);

// Users Route
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBauth, uploadImage);
app.post("/user", FBauth, addUserDetails);
app.get("/user", FBauth, getAuthenticatedUser);

// https://baseurl.com/api/
exports.api = functions.region("asia-east2").https.onRequest(app);

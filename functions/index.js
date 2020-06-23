const functions = require("firebase-functions");
const app = require("express")();
const FBauth = require("./util/fbAuth");
const { db } = require("./util/admin");
const {
  getAllScreams,
  postOneScream,
  getScream,
  commentOnScream,
  likeScream,
  unlikeScream,
  deleteScream,
} = require("./handlers/screams");
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead,
} = require("./handlers/users");

// Screams Route
app.get("/screams", getAllScreams);
app.post("/scream", FBauth, postOneScream);
app.get("/scream/:screamId", getScream);
app.delete("/scream/:screamId", FBauth, deleteScream);
app.get("/scream/:screamId/like", FBauth, likeScream);
app.get("/scream/:screamId/unlike", FBauth, unlikeScream);
app.post("/scream/:screamId/comment", FBauth, commentOnScream);

// Users Route
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBauth, uploadImage);
app.post("/user", FBauth, addUserDetails);
app.get("/user", FBauth, getAuthenticatedUser);
app.get(`/user/:handle`, getUserDetails);
app.post("/notifications", FBauth, markNotificationsRead);

// https://baseurl.com/api/
exports.api = functions.region("asia-east2").https.onRequest(app);

// Like Notofication
exports.createNotificationOnLike = functions
  .region("asia-east2")
  .firestore.document("likes/{id}")
  .onCreate((snapshot) => {
    db.doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "like",
            read: false,
            screamId: doc.id,
          });
        }
      })
      .then(() => {
        return;
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });

//
exports.deleteNotificationOnUnLike = functions
  .region("asia-east2")
  .firestore.document("likes/{id}")
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => {
        console.error(err);
        return;
      });
  });

// Comment Notification
exports.createNotificationOnComment = functions
  .region("asia-east2")
  .firestore.document("comments/{id}")
  .onCreate((snapshot) => {
    db.doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "comment",
            read: false,
            screamId: doc.id,
          });
        }
      })
      .then(() => {
        return;
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });

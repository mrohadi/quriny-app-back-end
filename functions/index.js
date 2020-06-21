const functions = require("firebase-functions");
const admin = require("firebase-admin");
const app = require("express")();
const firebase = require("firebase");

admin.initializeApp();

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbhN0izkOP9gN4XxKZ1zsc92Lpo4fhAIU",
  authDomain: "social-media-app-33923.firebaseapp.com",
  databaseURL: "https://social-media-app-33923.firebaseio.com",
  projectId: "social-media-app-33923",
  storageBucket: "social-media-app-33923.appspot.com",
  messagingSenderId: "795255708610",
  appId: "1:795255708610:web:a6bea33c3530e0ae2ed45b",
  measurementId: "G-V23N68SHYV",
};

// Initialize Firebae Token (Authentication)
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = admin.firestore();

// Route to see all the scream in the data base
app.get("/screams", (req, res) => {
  db.collection("screams")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let screams = [];
      data.forEach((doc) => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
        });
      });
      return res.json(screams);
    })
    .catch((err) => console.error(err));
});

// Route Post or create a new scream
app.post("/scream", (req, res) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString(),
  };

  db.collection("screams")
    .add(newScream)
    .then((doc) => {
      res.json({ message: `document ${doc.id} created succesfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
});

// Helper Function to check an email
const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (email.match(regEx)) return true;
  else return false;
};

// Helper function to determine the string is empy or not
const isEmpy = (string) => {
  if (string.trim() === "") return true;
  else return false;
};

// Route Sign Up
app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
  };

  // Check if there is an error
  let errors = {};
  if (isEmpy(newUser.email)) {
    errors.email = "Must not be empty";
  } else if (!isEmail(newUser.email)) {
    errors.email = "Must be a valid email adress";
  }

  if (isEmpy(newUser.password)) errors.password = "Must not be empty";
  if (newUser.password !== newUser.confirmPassword)
    errors.confirmPassword = "Password must be match";
  if (isEmpy(newUser.handle)) errors.handle = "Must not be empty";

  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  // TODO validate Data
  let token, userId;
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(400).json({ handle: `this handle is already taken` });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idToken) => {
      token = idToken;
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId: userId,
      };
      return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token: token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: "Email is already is used" });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
});

// Route login
app.post("/login", (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  // Check if there is an error
  let errors = {};

  if (isEmpy(user.email)) errors.email = "Must not be empty";
  if (isEmpy(user.password)) errors.password = "Must not be empty";

  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  // If there is no an error, then login
  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token: token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/wrong-password") {
        return res
          .status(403)
          .json({ general: "Wrong credentials, plese try again!" });
      } else return res.status(500).json({ error: err.code });
    });
});

// https://baseurl.com/api/
exports.api = functions.region("asia-east2").https.onRequest(app);

import { admin, db } from "../util/admin.js";
import config from '../util/config.js';
import firebase from 'firebase';

firebase.initializeApp(config);

import { validateSignupData, validateLoginData, reduceUserDetails } from "../util/validators.js";

import BusBoy from 'busboy';
import path from 'path';
import os from 'os';
import fs from 'fs'

const noImg = "no-img.png";

const auth = firebase.auth();

// Sign up user
export function signup(req, res) {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    userName: req.body.userName
  };

  const { valid, errors } = validateSignupData(newUser);

  if (!valid) return res.status(400).json(errors);

  let token, userId;

  auth
    .createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then(idToken => {
      token = idToken;
      const userCredentials = {
        userName: newUser.userName,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/userImages%2F${noImg}?alt=media`,
        userId
      };
      return db.doc(`/users/${userId}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch(err => {
      console.log(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: "email is already in use" });
      } else {
        return res.status(500).json({ general: 'Something went wrong, please try again' });
      }
    });
}

// Log user in
export function login(req, res) {
  const user = {
    email: req.body.email,
    password: req.body.password
  };

  const { valid, errors } = validateLoginData(user);
  if (!valid) return res.status(400).json(errors);

  auth
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      return data.user.getIdToken();
    })
    .then(token => {
      return res.json({ token });
    })
    .catch(err => {
      console.log(err);
      // auth/wrong-password
      // auth/user-not-found
      return res
        .status(403)
        .json({ general: "Wrong credentials, please try again" });
    });
}

export function getAllUsers(req, res) {
  db.collection("users")
    .orderBy("userName", "asc")
    .get()
    .then(data => {
      let users = [];
      data.forEach(doc => {
        users.push({
          ...doc.data()
        });
      });
      return res.json(users);
    })
    .catch(err => console.error(err));
}

// Add User Details
export function addUserDetails(req, res) {
  let userDetails = reduceUserDetails(req.body);

  db.doc(`/users/${req.user.uid}`).update(userDetails)
    .then(() => {
      return res.json({ message: 'Details added succesfully' });
    })
    .catch(err => {
      console.errror(err);
      return res.status(500).json({ error: err.code });
    })
}

// Get any user's details
export function getUser(req, res) {
  let userData = {};
  let categories = {};
  let tierListData;

  db.doc(`users/${req.params.userId}`).get()
    .then(doc => {
      if (doc.exists) {
        userData.user = doc.data();
        return db.collection('tierLists').where('userId', '==', req.params.userId)
          .orderBy('name', 'asc')
          .get();
      } else {
        return res.status(404).json({ error: 'User not found' });
      }
    })
    .then(data => {
      data.forEach(doc => {
        tierListData = doc.data();
        tierListData.tierListId = doc.id;
        if (!categories.hasOwnProperty(tierListData.category))
          categories[tierListData.category] = [tierListData];
        else {
          categories[tierListData.category].push(tierListData);
        }
      });
      const ordered = {};
      Object.keys(categories).sort().forEach(function (key) {
        ordered[key] = categories[key];
      });
      userData.tierLists = ordered;
      return db.collection('likes').where('userId', '==', req.params.userId).where('tierListName', '>=', '').get();
    })
    .then(data => {
      userData.likes = [];
      data.forEach(doc => {
        userData.likes.push({
          likeId: doc.id,
          ...doc.data()
        });
      })
      return res.json(userData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    })
}

// Get own user details
export function getAuthenticatedUser(req, res) {
  let userData = {};
  db.doc(`/users/${req.user.uid}`).get()
    .then(doc => {
      if (doc.exists) {
        userData.credentials = doc.data();
        userData.credentials.isManager = req.user.isManager;
        return db.collection('likes').where('userId', '==', req.user.uid).get();
      }
    })
    .then(data => {
      userData.likes = []
      data.forEach(doc => {
        userData.likes.push(doc.data());
      });
      return db.collection('notifications').where('recipientId', '==', req.user.uid)
        .orderBy('createdAt', 'desc').limit(10).get();
    })
    .then((data) => {
      userData.notifications = [];
      data.forEach(doc => {
        userData.notifications.push({
          notificationId: doc.id,
          ...doc.data()
        })
      });
      return res.json(userData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    })
}

// Upload a profile image for user
export function uploadImage(req, res) {
  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName;
  let imageToBeUploaded = {};
  let imageUrl;

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
      return res.status(400).json({ error: 'Wrong file type submitted' });
    }
    const imageExtension = filename.split(".")[filename.split(".").length - 1];
    const imgName = new Date().getTime();
    imageFileName = `${req.user.uid}_${imgName}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });

  busboy.on("finish", () => {
    const destinationData = `userImages/${imageFileName}`;
    admin
      .storage()
      .bucket(storageBucket)
      .upload(imageToBeUploaded.filepath, {
        destination: destinationData,
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype
          }
        }
      })
      .then(() => {
        imageUrl = `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/userImages%2F${imageFileName}?alt=media`;
        return db.doc(`/users/${req.user.uid}`).update({ imageUrl });
      })
      .then(() => {
        return res.json({
          imageUrl,
          message: "Image uploaded succesfully",
        });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  });

  busboy.end(req.rawBody);
}

// Mark notification read
export function markNotificationsRead(req, res) {
  let batch = db.batch();
  req.body.forEach(notificationId => {
    const notification = db.doc(`/notifications/${notificationId}`);
    batch.update(notification, { read: true });
  });
  batch.commit()
    .then(() => {
      return res.json({ message: 'Notifications marked read' });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    })
}

// Delete a user
export function deleteUser(req, res) {
  const document = db.doc(`/users/${req.params.userId}`);
  document.get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "User not found" });
      }
      if (!req.user.isManager) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        document.delete()
          .then(() => {
            admin.auth().deleteUser(req.params.userId);
          })
          .then(() => {
            return res.json({ message: "User deleted successfully" });
          })
          .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
          });
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
}
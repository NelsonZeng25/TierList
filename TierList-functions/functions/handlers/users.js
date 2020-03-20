const { admin, db } = require("../util/admin");

const config = require("../util/config");

const firebase = require("firebase");
firebase.initializeApp(config);

const { validateSignupData, validateLoginData, reduceUserDetails } = require("../util/validators");

// Sign up user
exports.signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    userName: req.body.userName
  };

  const { valid, errors } = validateSignupData(newUser);

  if (!valid) return res.status(400).json(errors);

  const noImg = "no-img.png";

  let token, userId;

  // This part basically checks the collection of users to see if a userName has already been taken
  // However, in our app, we don't care about unique userNames

  // db.doc(`/users/${newUser.userName}`).get()
  //     .then(doc => {
  //         if (doc.exists) {
  //             return res.status(400).json({ userName: 'This handle is already taken'});
  //         } else {
  //             return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
  //         }
  //     })
  //     .then(data => {
  //         userId = data.user.uid;
  //         return data.user.getIdToken();
  //     })
  //     .then(token => {
  //         token = token;
  //         const userCredentials = {
  //             userName: newUser.userName,
  //             email: newUser.email,
  //             createdAt: new Date().toISOString(),
  //             userId
  //         };
  //         return db.doc(`/users/${newUser.userName}`).set(userCredentials);
  //     })
  //     .then(() => {
  //         return res.status(201).json({ token });
  //     })
  //     .catch(err => {
  //         console.log(err);
  //         if (err.code === "auth/email-already-in-use") {
  //             return res.status(400).json({ email: "email is already in use"})
  //         } else {
  //             return res.status(500).json({ error: err.code });
  //         }
  //     })

  firebase
    .auth()
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
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
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
        return res.status(500).json({ error: err.code });
      }
    });
};

// Log user in
exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };

  const { valid, errors } = validateLoginData(user);

  if (!valid) return res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      return data.user.getIdToken();
    })
    .then(token => {
      return res.json({ token });
    })
    .catch(err => {
      console.log(err);
      if (err.code === "auth/wrong-password") {
        return res
          .status(403)
          .json({ general: "wrong credentials, please try again" });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
};

// Add User Details
exports.addUserDetails = (req, res) => {
  let userDetails = reduceUserDetails(req.body);

  db.doc(`/users/${req.user.uid}`).update(userDetails)
    .then(() => {
      return res.json({ message: 'Details added succesfully'});
    })
    .catch(err => {
      console.errror(err);
      return res.status(500).json({ error: err.code });
    })
}

// Get own user details
exports.getAuthenticatedUser = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.user.uid}`).get()
    .then(doc => {
      if(doc.exists) {
        userData.credentials = doc.data();
        return db.collection('likes').where('userId', '==', req.user.uid).get();
      }
    })
    .then(data => {
      userData.likes = []
      data.forEach(doc => {
        userData.likes.push(doc.data());
      });
      return res.json(userData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    })
}

// Upload a profile image for user
exports.uploadImage = (req,res) => {
    const BusBoy = require("busboy");
    const path = require("path");
    const os = require("os");
    const fs = require("fs");

    const busboy = new BusBoy({ headers: req.headers });

    let imageFileName;
    let imageToBeUploaded = {};

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
        return res.status(400).json({ error: 'Wrong file type submitted'});
      }
      const imageExtension = filename.split(".")[filename.split(".").length - 1];
      imageFileName = `${Math.round(Math.random() * 100000000000)}.${imageExtension}`;
      const filepath = path.join(os.tmpdir(), imageFileName);
      imageToBeUploaded = { filepath, mimetype };
      file.pipe(fs.createWriteStream(filepath));
    });

    busboy.on("finish", () => {
      admin
        .storage()
        .bucket()
        .upload(imageToBeUploaded.filepath, {
          resumable: false,
          metadata: {
            metadata: {
              contentType: imageToBeUploaded.mimetype
            }
          }
        })
        .then(() => {
          const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
          return db.doc(`/users/${req.user.uid}`).update({ imageUrl });
        })
        .then(() => {
          return res.json({ message: "Image uploaded succesfully" });
        })
        .catch((err) => {
          console.error(err);
          return res.status(500).json({ error: err.code });
        });
    });

    busboy.end(req.rawBody);
};

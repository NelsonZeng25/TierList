const admin = require("firebase-admin");

//const functions = require('firebase-functions');
// admin.initializeApp(functions.config().firebase);

admin.initializeApp({
    credential: admin.credential.cert(require('../../../../../Project/TierList/admin.json')),
    databaseURL: "https://tierlist-57d59.firebaseio.com",
    storageBucket: "tierlist-57d59.appspot.com"
});

const db = admin.firestore();

module.exports = { admin, db };
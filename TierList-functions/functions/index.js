const functions = require("firebase-functions");
const express = require("express");
const app = express();

const { db } = require('./util/admin');

const FBAuth = require('./util/fbAuth');

const { getAllTierLists, postOneTierList, getTierList, 
    commentOnTierList, likeTierList, unlikeTierList, deleteTierList } = require('./handlers/tierLists');
const { getAllComments, postOneComment, getComment, 
    replyOnComment, deleteComment, likeComment, unlikeComment } = require('./handlers/comments');
const { getAllReplies, postOneReply, getReply, deleteReply, likeReply, unlikeReply } = require('./handlers/replies');
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser } = require('./handlers/users');

// tierLists routes
app.get("/tierLists", getAllTierLists);
app.post("/createTierList", FBAuth, postOneTierList);
app.get("/tierLists/:tierListId", getTierList);
app.delete("/tierLists/:tierListId", FBAuth, deleteTierList);
app.get('/tierLists/:tierListId/like', FBAuth, likeTierList);
app.get('/tierLists/:tierListId/unlike', FBAuth, unlikeTierList);
app.post('/tierlists/:tierListId/comment', FBAuth, commentOnTierList);

// comments route
app.get("/comments", getAllComments);
app.post("/createComment", FBAuth, postOneComment);
app.get("/comments/:commentId", getComment);
app.delete("/comments/:commentId", FBAuth, deleteComment);
app.get('/comments/:commentId/like', FBAuth, likeComment);
app.get('/comments/:commentId/unlike', FBAuth, unlikeComment);
app.post('/comments/:commentId/reply', FBAuth, replyOnComment);

// replies route
app.get("/replies", getAllReplies);
app.post("/createReply", FBAuth, postOneReply);
app.get("/replies/:replyId", getReply);
app.delete("/replies/:replyId", FBAuth, deleteReply);
app.get('/replies/:replyId/like', FBAuth, likeReply);
app.get('/replies/:replyId/unlike', FBAuth, unlikeReply);

// users route
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);


// https://baseurl.com/api/

exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions.firestore.document('likes/{id}')
    .onCreate((snapshot) => {
        // Check for which one! HERE
        db.doc(`/tierLists/${snapshot.data().tierListId}`).get()
            .then(doc => {
                if (doc.exists) {
                    return db.doc(`/notification/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userName,
                        sender: snapshot.data().userName,
                        type: 'like',
                        read: false,
                        itemId: doc.id,
                    })
                }
            })
            .then(() => {
                return;
            })
            .catch(err => {
                console.error(err);
                return;
            })
    });

exports.deleteNotificationOnUnlike = functions.firestore.document('likes/{id}')
    .onDelete((snapshot) => {
        db.doc(`/notifications/${snapshot.id}`)
            .delete()
            .then(() => {
                return;
            })
            .catch(err => {
                console.error(err);
                return;
            })
    })

exports.createNotificationOnComment = functions.firestore.document('comments/{id}')
    .onCreate((snapshot) => {
        // Check for which one! HERE
        db.doc(`/tierLists/${snapshot.data().tierListId}`).get()
            .then(doc => {
                if (doc.exists) {
                    return db.doc(`/notification/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userName,
                        sender: snapshot.data().userName,
                        type: 'comment',
                        read: false,
                        itemId: doc.id,
                    })
                }
            })
            .then(() => {
                return;
            })
            .catch(err => {
                console.error(err);
                return;
            })
    });
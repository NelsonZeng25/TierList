const functions = require("firebase-functions");
const express = require("express");
const app = express();

const { db } = require('./util/admin');

const FBAuth = require('./util/fbAuth');

const { getAllTierLists, postOneTierList, getTierList, 
    commentOnTierList, likeTierList, unlikeTierList, deleteTierList } = require('./handlers/tierLists');
const { getAllTierItems, postOneTierItem, getTierItem, deleteTierItem } = require('./handlers/tierItems');
const { getAllCategories, postOneCategory, getCategory, deleteCategory } = require('./handlers/tierItems');
const { getAllComments, getComment, 
    replyOnComment, deleteComment, likeComment, unlikeComment } = require('./handlers/comments');
const { getAllReplies, getReply, deleteReply, likeReply, unlikeReply } = require('./handlers/replies');
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser, getUserDetails, markNotificationsRead, deleteUser, getAllUsers } = require('./handlers/users');
const { getAllManagers, postOneManager, deleteManager } = require('./handlers/managers');

// tierLists routes
app.get("/tierLists", getAllTierLists);
app.post("/tierLists/createTierList", FBAuth, postOneTierList);
app.get("/tierLists/:tierListId", getTierList);
app.delete("/tierLists/:tierListId", FBAuth, deleteTierList);
app.get('/tierLists/:tierListId/like', FBAuth, likeTierList);
app.get('/tierLists/:tierListId/unlike', FBAuth, unlikeTierList);
app.post('/tierlists/:tierListId/comment', FBAuth, commentOnTierList);

// // tierItem routes
// app.get("/tierItems", getAllTierItems);
// app.post("/createTierItem", FBAuth, postOneTierItem);
// app.get("/tierItems/:tierItemId", FBAuth, getTierItem);
// app.delete("/tierItems/:tierItemId", FBAuth, deleteTierItem);

// // categories routes
// app.get("/categories", getAllCategories);
// app.post("/createCategory", FBAuth, postOneCategory);
// app.get("/categories/:categoryId", FBAuth, getCategory);
// app.delete("/categories/:categoryId", FBAuth, deleteCategory);

// comments route
app.get("/comments", getAllComments);
app.get("/comments/:commentId", getComment);
app.delete("/comments/:commentId", FBAuth, deleteComment);
app.get('/comments/:commentId/like', FBAuth, likeComment);
app.get('/comments/:commentId/unlike', FBAuth, unlikeComment);
app.post('/comments/:commentId/reply', FBAuth, replyOnComment);

// replies route
app.get("/replies", getAllReplies);
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
app.get('/user/:userId', getUserDetails);
app.post('/notifications', FBAuth, markNotificationsRead);
app.delete('/users/:userId', FBAuth, deleteUser);
app.get('/users', getAllUsers);

// managers route
app.get('/managers', getAllManagers);
app.post('/managers/createManager', FBAuth, postOneManager);
app.delete('/managers/:managerId', FBAuth, deleteManager);

exports.api = functions.https.onRequest(app);

// Create notification on Likes
exports.createNotificationOnLike = functions.firestore.document('likes/{id}')
    .onCreate((snapshot) => {
        let collection, itemId;
        if (snapshot.data().hasOwnProperty('tierListId')) {
            collection = 'tierLists';
            itemId = snapshot.data().tierListId;
        } else if (snapshot.data().hasOwnProperty('commentId')) {
            collection = 'comments';
            itemId = snapshot.data().commentId;
        } else {
            collection = 'replies';
            itemId = snapshot.data().replyId;
        }

        return db.doc(`/${collection}/${itemId}`).get()
            .then(doc => {
                if (doc.exists && doc.data().userId !== snapshot.data().userId) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipientName: doc.data().userName,
                        recipientId: doc.data().userId,
                        senderName: snapshot.data().userName,
                        senderId: snapshot.data().userId,
                        type: 'like',
                        read: false,
                        itemId: doc.id,
                    })
                }
            })
            .catch(err => {
                console.error(err);
            })
});

// Delete notifications on Unlikes
exports.deleteNotificationOnUnlike = functions.firestore.document('likes/{id}')
    .onDelete((snapshot) => {
        return db.doc(`/notifications/${snapshot.id}`)
            .delete()
            .catch(err => {
                console.error(err);
            })
})

// Create notifications on Comments
exports.createNotificationOnComment = functions.firestore.document('comments/{id}')
    .onCreate((snapshot) => {
        return db.doc(`/tierLists/${snapshot.data().tierListId}`).get()
            .then(doc => {
                if (doc.exists && doc.data().userId !== snapshot.data().userId) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipientName: doc.data().userName,
                        recipientId: doc.data().userId,
                        senderName: snapshot.data().userName,
                        senderId: snapshot.data().userId,
                        type: 'comment',
                        read: false,
                        itemId: doc.id,
                    })
                }
            })
            .catch(err => {
                console.error(err);
            })
    });

// Create notifications on Replies
exports.createNotificationOnReply = functions.firestore.document('replies/{id}')
    .onCreate((snapshot) => {
        return db.doc(`/comments/${snapshot.data().commentId}`).get()
            .then(doc => {
                if (doc.exists && doc.data().userId !== snapshot.data().userId) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipientName: doc.data().userName,
                        recipientId: doc.data().userId,
                        senderName: snapshot.data().userName,
                        senderId: snapshot.data().userId,
                        type: 'reply',
                        read: false,
                        itemId: doc.id,
                    })
                }
            })
            .catch(err => {
                console.error(err);
            })
});

// Changes all Names of user if user updates name
exports.onUserNameOrImageChange = functions.firestore.document('/users/{userId}')
    .onUpdate((change) => {
        // console.log(change.before.data());
        // console.log(change.after.data());
        const batch = db.batch();
        if (change.before.data().imageUrl !== change.after.data().imageUrl || change.before.data().userName !== change.after.data().userName) {
            return db.collection('tierLists').where('userId', '==', change.before.data().userId).get()
                .then(data => {
                    data.forEach(doc => {
                        const tierList = db.doc(`/tierLists/${doc.id}`);
                        batch.update(tierList, { userName: change.after.data().userName });
                        batch.update(tierList, { userImage: change.after.data().imageUrl });
                    });
                    return db.collection('comments').where('userId', '==', change.before.data().userId).get();
                })
                .then(data => {
                    data.forEach(doc => {
                        const comment = db.doc(`/comments/${doc.id}`);
                        batch.update(comment, { userName: change.after.data().userName });
                        batch.update(comment, { userImage: change.after.data().imageUrl });
                    });
                    return db.collection('replies').where('userId', '==', change.before.data().userId).get();
                })
                .then(data => {
                    data.forEach(doc => {
                        const reply = db.doc(`/replies/${doc.id}`);
                        batch.update(reply, { userName: change.after.data().userName });
                        batch.update(reply, { userImage: change.after.data().imageUrl });
                    });
                    return db.collection('managers').where('userId', '==', change.before.data().userId).limit(1).get();
                })
                .then(data => {
                    const manager = db.doc(`/managers/${data.docs[0].data().userId}`);
                    batch.update(manager, { userName: change.after.data().userName });
                    batch.update(manager, { userImage: change.after.data().imageUrl });
                    return db.collection('likes').where('userId', '==', change.before.data().userId).get();
                })
                .then(data => {
                    data.forEach(doc => {
                        const like = db.doc(`/likes/${doc.id}`);
                        batch.update(like, { userName: change.after.data().userName });
                    });
                    return db.collection('notifications').where('recipientId', '==', change.before.data().userId).get();
                })
                .then(data => {
                    data.forEach(doc => {
                        const notification = db.doc(`/notifications/${doc.id}`);
                        batch.update(notification, { recipientName: change.after.data().userName });
                    });
                    return db.collection('notifications').where('senderId', '==', change.before.data().userId).get();
                })
                .then(data => {
                    data.forEach(doc => {
                        const notification = db.doc(`/notifications/${doc.id}`);
                        batch.update(notification, { senderName: change.after.data().userName });
                    });
                    return batch.commit();
                })
                
                .catch(err => console.error(err));
        } else {
            return true;
        }
})

// Deletes all related components when Tier List gets deleted
exports.onTierListDelete = functions.firestore.document('/tierLists/{tierListId}')
    .onDelete((snapshot, context) => {
        const tierListId = context.params.tierListId;
        const batch = db.batch();
        let commentIds = [];
        let replyIds = [];
        return db.collection('comments').where('tierListId', '==', tierListId).get()
            .then(data => {
                data.forEach(doc => {
                    if (doc.data().likeCount > 0 || doc.data().replyCount > 0) commentIds.push(doc.id);
                    db.collection('replies').where('commentId', '==', doc.id).get()
                        .then(data => {
                            data.forEach(doc => {
                                if (doc.data().likeCount > 0) replyIds.push(doc.id);
                                batch.delete(db.doc(`/replies/${doc.id}`));
                            });
                        })
                    batch.delete(db.doc(`/comments/${doc.id}`));
                })
                return db.collection('notifications').get();
            }) 
            .then(data => {
                data.forEach(doc => {
                    if (doc.data().itemId === tierListId || (doc.data().type === 'reply' && commentIds.includes(doc.data().itemId)))
                        batch.delete(db.doc(`/notifications/${doc.id}`));
                })
                return db.collection('likes').get();
            })
            .then(data => {
                data.forEach(doc => {
                    if ((doc.data().hasOwnProperty('tierListId') && doc.data().tierListId === tierListId) ||
                        (doc.data().hasOwnProperty('commentId') && commentIds.includes(doc.data().commentId)) ||
                        (doc.data().hasOwnProperty('replyId') && replyIds.includes(doc.data().replyId)))
                        batch.delete(db.doc(`/likes/${doc.id}`))
                });
                return batch.commit();
            })
            .catch(err => console.error(err));
})

// Deletes all replies and likes when Comment gets deleted
exports.onCommentDelete = functions.firestore.document('/comments/{commentId}')
    .onDelete((snapshot, context) => {
        const commentId = context.params.commentId;
        const batch = db.batch();
        let replyIds = [];
        return db.collection('replies').where('commentId', '==', commentId).get()
            .then(data => {
                data.forEach(doc => {
                    if (doc.data().likeCount > 0) replyIds.push(doc.id);
                    batch.delete(db.doc(`/replies/${doc.id}`));
                })
                return db.collection('notifications').where('itemId', '==', commentId).get();
            }) 
            .then(data => {
                data.forEach(doc => batch.delete(db.doc(`/notifications/${doc.id}`)));
                return db.collection('likes').get();
            })
            .then(data => {
                data.forEach(doc => {
                    if ((doc.data().hasOwnProperty('commentId') && doc.data().commentId === commentId) ||
                        (doc.data().hasOwnProperty('replyId') && replyIds.includes(doc.data().replyId)))
                        batch.delete(db.doc(`/likes/${doc.id}`))
                });
                return batch.commit();
            })
            .catch(err => console.error(err));
})

// Deletes all likes when Reply gets deleted
exports.onReplyDelete = functions.firestore.document('/replies/{replyId}')
    .onDelete((snapshot, context) => {
        const replyId = context.params.replyId;
        const batch = db.batch();
        return db.collection('notifications').get()
            .then(data => {
                data.forEach(doc => {
                    if (doc.id === replyId)
                        batch.delete(db.doc(`/notifications/${doc.id}`));
                });
                return db.collection('likes').where('replyId', '==', replyId).get();
            })
            .then(data => {
                data.forEach(doc => batch.delete(db.doc(`/likes/${doc.id}`)));
                return batch.commit();
            })
            .catch(err => console.error(err));
})

// TODO Make Manager access everything
// TODO Add tierItems
// TODO Add the rest of the db event methods (change tierItem name / image, delete category -> delete all tierLists???)

import { https, firestore } from "firebase-functions";
import express from "express";

const app = express();

// https://stackoverflow.com/questions/46337471/how-to-allow-cors-in-react-js
app.use(function(req, res, next) {
    // Dev env
    // res.set('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Prod env
    var allowedOrigins = ['https://tierlist-57d59.web.app', 'https://tierlist-57d59.firebaseapp.com'];
    var origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.set('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.set('Access-Control-Allow-Credentials', 'true');
    next();
});

// CORS ERROR FIX (more like a realization than a fix)
// https://stackoverflow.com/questions/52597210/how-to-solve-cors-in-firebase-functions-enviroment/52598794

import config from './util/config.js';
import { admin, db } from './util/admin.js';
import FBAuth from './util/fbAuth.js';

import { getAllTierLists, postOneTierList, getTierList, commentOnTierList, likeTierList, unlikeTierList, deleteTierList, addTierItemToTierList, deleteTierItemFromTierList } from './handlers/tierLists.js';

import { getAllTierItems, postOneTierItem, getTierItem, deleteTierItem, updateTierItem, uploadTierItemImage } from './handlers/tierItems.js';

import { getAllCategories, getAllCategoriesWithTierLists, getAllCategoriesWithTierListsForUser, getTierItemsForOneCategory, postOneCategory, getCategory, deleteCategory, updateCategory } from './handlers/categories.js';

import { getAllComments, getComment, replyOnComment, deleteComment, likeComment, unlikeComment, updateComment } from './handlers/comments.js';

import { getAllReplies, getReply, deleteReply, likeReply, unlikeReply, updateReply } from './handlers/replies.js';

import { signup, login, uploadImage, addUserDetails, getAuthenticatedUser, getUser, markNotificationsRead, deleteUser, getAllUsers } from './handlers/users.js';

import { getAllManagers, postOneManager, deleteManager } from './handlers/managers.js';

// tierLists routes
app.get("/tierLists", getAllTierLists);
app.post("/tierLists/createTierList", FBAuth, postOneTierList);
app.get("/tierLists/:tierListId", getTierList);
app.delete("/tierLists/:tierListId", FBAuth, deleteTierList);
app.put('/tierLists/:tierListId/tierItems/:tierItemId', FBAuth, addTierItemToTierList);
app.delete('/tierLists/:tierListId/tierItems/:tierItemId', FBAuth, deleteTierItemFromTierList);
app.get('/tierLists/:tierListId/like', FBAuth, likeTierList);
app.get('/tierLists/:tierListId/unlike', FBAuth, unlikeTierList);
app.post('/tierLists/:tierListId/comment', FBAuth, commentOnTierList);

// tierItem routes
app.get("/tierItems", getAllTierItems);
app.post("/tierItems/createTierItem", FBAuth, postOneTierItem);
app.get("/tierItems/:tierItemId", FBAuth, getTierItem);
app.delete("/tierItems/:tierItemId", FBAuth, deleteTierItem);
app.put('/tierItems/:tierItemId', FBAuth, updateTierItem);
app.post("/tierItems/image", FBAuth, uploadTierItemImage);

// categories routes
app.get("/categories", getAllCategories);
app.get('/categoriesWithTierLists', getAllCategoriesWithTierLists);
app.get('/categoriesWithTierLists/:userId', getAllCategoriesWithTierListsForUser),
app.get('/getTierItemsForOneCategory/:category', FBAuth, getTierItemsForOneCategory);
app.post("/categories/createCategory", FBAuth, postOneCategory);
app.get("/categories/:categoryId", getCategory);
app.delete("/categories/:categoryId", FBAuth, deleteCategory);
app.put('/categories/:categoryId', FBAuth, updateCategory);

// comments route
app.get("/comments", getAllComments);
app.get("/comments/:commentId", getComment);
app.delete("/comments/:commentId", FBAuth, deleteComment);
app.put('/comments/:commentId', FBAuth, updateComment);
app.get('/comments/:commentId/like', FBAuth, likeComment);
app.get('/comments/:commentId/unlike', FBAuth, unlikeComment);
app.post('/comments/:commentId/reply', FBAuth, replyOnComment);

// replies route
app.get("/replies", getAllReplies);
app.get("/replies/:replyId", getReply);
app.delete("/replies/:replyId", FBAuth, deleteReply);
app.put('/replies/:replyId', FBAuth, updateReply);
app.get('/replies/:replyId/like', FBAuth, likeReply);
app.get('/replies/:replyId/unlike', FBAuth, unlikeReply);

// users route
app.get('/users', getAllUsers);
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);
app.get('/users/:userId', getUser);
app.post('/notifications', FBAuth, markNotificationsRead);
app.delete('/users/:userId', FBAuth, deleteUser);

// managers route
app.get('/managers', getAllManagers);
app.post('/managers/createManager', FBAuth, postOneManager);
app.delete('/managers/:managerId', FBAuth, deleteManager);

export const api = https.onRequest(app);

export const createNotificationOnLike = firestore.document('likes/{id}')
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

export const deleteNotificationOnUnlike = firestore.document('likes/{id}')
    .onDelete((snapshot) => {
        return db.doc(`/notifications/${snapshot.id}`)
            .delete()
            .catch(err => {
                console.error(err);
            })
})

export const createNotificationOnComment = firestore.document('comments/{id}')
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

export const createNotificationOnReply = firestore.document('replies/{id}')
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

const defaultUserImg = 'https://firebasestorage.googleapis.com/v0/b/tierlist-57d59.appspot.com/o/userImages%2Fno-img.png?alt=media';
export const onUserDelete = firestore.document('/users/{userId}')
    .onDelete((snapshot, context) => {
        const userId = context.params.userId;
        const batch = db.batch();
        let commentId, comment, reply;
        let tierListIds = [];
        let commentIds = [];
        let replyIds = [];
        return db.collection('tierLists').where('userId', '==', userId).get()
            .then(data => {
                data.forEach(doc => {
                    if (doc.data().likeCount > 0 || doc.data().commentCount > 0)
                        tierListIds.push(doc.id);
                    batch.delete(db.doc(`/tierLists/${doc.id}`))
                });
                return db.collection('comments').where('userId', '==', userId).get()
            })
            .then(data => {
                data.forEach(doc => {
                    commentId = doc.id;
                    if (doc.data().likeCount > 0 || doc.data().replyCount > 0) commentIds.push(commentId);
                    db.collection('replies').get()
                        .then(data => {
                            data.forEach(doc => {
                                if (doc.data().userId === userId)
                                    if (doc.data().likeCount > 0) 
                                        replyIds.push(doc.id);
                                    reply = db.doc(`/replies/${doc.id}`);
                                    batch.update(reply, { userId: '[Deleted]' });
                                    batch.update(reply, { userName: '[Deleted]' });
                                    batch.update(reply, { userImage: defaultUserImg });
                            });
                        })
                    comment = db.doc(`/comments/${doc.id}`);
                    batch.update(comment, { userId: '[Deleted]' });
                    batch.update(comment, { userName: '[Deleted]' });
                    batch.update(comment, { userImage: defaultUserImg });
                })
                return db.collection('notifications').get();
            })
            .then(data => {
                data.forEach(doc => {
                    if (doc.data().recipientId === userId || doc.data().senderId === userId ||tierListIds.includes(doc.data().itemId) || 
                        commentIds.includes(doc.data().itemId) || replyIds.includes(doc.data().itemId))
                        batch.delete(db.doc(`/notifications/${doc.id}`));
                })
                return db.collection('likes').get();
            })
            .then(data => {
                data.forEach(doc => {
                    if (doc.data().userId === userId || (doc.data().hasOwnProperty('tierListId') && tierListIds.includes(doc.data().tierListId)))
                        batch.delete(db.doc(`/likes/${doc.id}`));
                });
                return db.collection('managers').where('userId', '==', userId).get();
            })
            .then(data => {
                data.forEach(doc => batch.delete(db.doc(`/managers/${doc.data().userId}`)));
                return db.collection('tierItems').where('userId', '==', userId).get();
            }).then(data => {
                data.forEach(doc => batch.update(db.doc(`/tierItems/${doc.id}`), { userId: '[Deleted]' }));
                return batch.commit();
            })
            .catch(err => console.error(err));
    })

export const onUserNameOrImageChange = firestore.document('/users/{userId}')
    .onUpdate((change) => {
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
                    return db.collection('managers').where('userId', '==', change.before.data().userId).get();
                })
                .then(data => {
                    data.forEach(doc => {
                        const manager = db.doc(`/managers/${data.docs[0].data().userId}`);
                        batch.update(manager, { userName: change.after.data().userName });
                        batch.update(manager, { imageUrl: change.after.data().imageUrl });
                    })
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
                    if (change.before.data().imageUrl !== change.after.data().imageUrl && change.before.data().imageUrl !== defaultUserImg) {
                        const bucket = admin.storage().bucket(config.storageBucket);
                        const fileName = change.before.data().imageUrl.split('%2F')[1].split('?')[0];
                        bucket.file(`userImages/${fileName}`).delete();
                    }
                    return batch.commit();
                })
                .catch(err => console.error(err));
        } else {
            return true;
        }
})

const defaultTierItemImg = 'https://firebasestorage.googleapis.com/v0/b/tierlist-57d59.appspot.com/o/tierItemImages%2Fno-img.png?alt=media';
export const onTierItemNameOrImageChange = firestore.document('/tierItems/{tierItemId}')
    .onUpdate((change, context) => {
        const tierItemId = context.params.tierItemId;
        let tierList, tierItemData;
        let temp = {};
        let updateTierItem = {};
        const batch = db.batch();
        if (change.before.data().imageUrl !== change.after.data().imageUrl || change.before.data().name !== change.after.data().name) {
            return db.collection('tierLists').get()
                .then(data => {
                    data.forEach(doc => {
                        if (doc.data().tierItems.hasOwnProperty(tierItemId)) {
                            updateTierItem = doc.data().tierItems[tierItemId];
                            updateTierItem['name'] = change.after.data().name;
                            updateTierItem['imageUrl'] = change.after.data().imageUrl;

                            tierItemData = doc.data().tierItems;
                            temp[tierItemId] = updateTierItem;
                            Object.assign(tierItemData, temp);

                            tierList = db.doc(`/tierLists/${doc.id}`);
                            batch.update(tierList, { tierItems: tierItemData });
                        }
                    });
                    if (change.before.data().imageUrl !== change.after.data().imageUrl && change.before.data().imageUrl !== defaultTierItemImg) {
                        const bucket = admin.storage().bucket(config.storageBucket);
                        const fileName = change.before.data().imageUrl.split('%2F')[1].split('?')[0];
                        return bucket.file(`tierItemImages/${fileName}`).delete();
                    }
                })
                .then(() => {
                    return batch.commit();
                })
                .catch(err => console.error(err));
        } else {
            return true;
        }
    })

export const onTierItemDelete = firestore.document("/tierItems/{tierItemId}")
    .onDelete((snapshot, context) => {
        const tierItemId = context.params.tierItemId;
        let tierList, tierItemData;
        const batch = db.batch();
        return db.collection("tierLists").get()
            .then(data => {
                data.forEach(doc => {
                    if (doc.data().tierItems.hasOwnProperty(tierItemId)) {
                        tierItemData = doc.data().tierItems;
                        delete tierItemData[tierItemId];

                        tierList = db.doc(`/tierLists/${doc.id}`);
                        batch.update(tierList, { tierItems: tierItemData });
                    }
                });
                if (snapshot.data().imageUrl !== defaultTierItemImg) {
                    const bucket = admin.storage().bucket(config.storageBucket);
                    const fileName = snapshot.data().imageUrl.split('%2F')[1].split('?')[0];
                    return bucket.file(`tierItemImages/${fileName}`).delete();
                }
                return batch.commit();
            })
            .catch(err => console.error(err));
  });

export const onTierListDelete = firestore.document('/tierLists/{tierListId}')
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
                    if (doc.data().itemId === tierListId || commentIds.includes(doc.data().itemId) || replyIds.includes(doc.data().itemId))
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

export const onCommentDelete = firestore.document('/comments/{commentId}')
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
                return db.collection('notifications').get();
            }) 
            .then(data => {
                data.forEach(doc => {
                    if (doc.data().itemId === commentId || doc.id === commentId)
                        batch.delete(db.doc(`/notifications/${doc.id}`))
                });
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

export const onReplyDelete = firestore.document('/replies/{replyId}')
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
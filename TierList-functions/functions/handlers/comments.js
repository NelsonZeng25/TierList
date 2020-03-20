const { db } = require('../util/admin');

exports.getAllComments = (req, res) => {
    db.collection("comments")
      .orderBy("createdAt", "desc")
      .get()
      .then(data => {
        let comments = [];
        data.forEach(doc => {
          comments.push({
            commentId: doc.id,
            ...doc.data()
          });
        });
        return res.json(comments);
      })
      .catch((err) => {
          console.error(err);
          return res.status(500).json({ error: err.code });
      });
}

exports.postOneComment = (req, res) => {
    const newComment = {
      body: req.body.body,
      userName: req.user.userName,
      userId: req.user.uid,
      userImage: req.user.imageUrl,
      createdAt: new Date().toISOString(),
      likeCount: 0,
      replyCount: 0,
    };
  
    db.collection("comments")
      .add(newComment)
      .then(doc => {
        const resComment = newComment;
        resComment.commentId = doc.id;
        res.json(resComment);
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({ error: "Something went wrong" });
      });
}

// Get 1 Comment
exports.getComment = (req, res) => {
  let commentData = {};
  db.doc(`comments/${req.params.commentId}`).get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Comment not found'})
      }
      commentData = doc.data();
      commentData.commentId = doc.id;
      return db.collection('replies')
        .orderBy('createdAt', 'desc')
        .where('commentId', '==', req.params.commentId).get();
    })
    .then(data => {
      commentData.replies = [];
      data.forEach(doc => {
        commentData.replies.push(doc.data());
      });
      return res.json(commentData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    })
}

// Reply to 1 Comment
exports.replyOnComment = (req, res) => {
  if (req.body.body.trim() === '') return res.status(400).json({ error: 'Must not be empty'});

  const newReply = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    commentId: req.params.commentId,
    userName: req.user.userName,
    userId: req.user.uid,
    userImage: req.user.imageUrl,
    likeCount: 0,
  };

  db.doc(`comments/${req.params.commentId}`).get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Comment not found'})
      }
      return doc.ref.update({ replyCount: doc.data().replyCount + 1 });
    })
    .then(() => {
      return db.collection('replies').add(newReply);
    })
    .then((doc) => {
      const resReply = newReply;
      resReply.replyId = doc.id;
      return res.json(resReply);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: 'Something went wrong' });
    })
}

// Like a Comment
exports.likeComment = (req, res) => {
  const likeDocument = db.collection('likes').where('userId', '==', req.user.uid)
    .where('commentId', '==', req.params.commentId).limit(1);

  const commentDocument = db.doc(`/comments/${req.params.commentId}`);

  let commentData;
  commentDocument.get()
    .then(doc => {
      if (doc.exists) {
        commentData = doc.data();
        commentData.commentId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: 'Comment not found' });
      }
    })
    .then(data => {
      if (data.empty) {
        return db.collection('likes').add({
          commentId: req.params.commentId,
          userName: req.user.userName,
          userId: req.user.uid,
        })
        .then(() => {
          commentData.likeCount++;
          return commentDocument.update({ likeCount: commentData.likeCount });
        })
        .then(() => {
          return res.json(commentData);
        })
      } else {
        return res.status(400).json({ error: 'Comment already liked' });
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    })
};

// Unlike a Comment
exports.unlikeComment = (req, res) => {
  const likeDocument = db.collection('likes').where('userId', '==', req.user.uid)
  .where('commentId', '==', req.params.commentId).limit(1);

  const commentDocument = db.doc(`/comments/${req.params.commentId}`);

  let commentData;

  commentDocument.get()
    .then(doc => {
      if (doc.exists) {
        commentData = doc.data();
        commentData.commentId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: 'Comment not found' });
      }
    })
    .then(data => {
      if (data.empty) {
        return res.status(400).json({ error: 'Comment not liked' });
      } else {
        return db.doc(`/likes/${data.docs[0].id}`).delete()
          .then(() => {
            commentData.likeCount--;
            return commentDocument.update({ likeCount: commentData.likeCount });
          })
          .then(() => {
            res.json(commentData);
          })
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    })
}

// Delete Comment
exports.deleteComment = (req, res) => {
  const document = db.doc(`/comments/${req.params.commentId}`);
  let tierListDocument;
  document.get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Comment not found'})
      }
      if (doc.data().userId !== req.user.uid) {
        return res.status(403).json({ error: 'Unauthorized'});
      } else {
        tierListDocument = db.doc(`/tierLists/${doc.data().tierListId}`);
        return tierListDocument.get();
      }
    })
    .then((doc) => {
      return tierListDocument.update({ commentCount: doc.data().commentCount - 1 });
    })
    .then(() => {
      return document.delete();
    })
    .then(() => {
      res.json({ message: 'Comment deleted successfully'});
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    })
}
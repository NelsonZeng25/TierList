const { db } = require('../util/admin');

exports.getAllReplies = (req, res) => {
    db.collection("replies")
      .orderBy("createdAt", "desc")
      .get()
      .then(data => {
        let replies = [];
        data.forEach(doc => {
            replies.push({
            replyId: doc.id,
            ...doc.data()
          });
        });
        return res.json(replies);
      })
      .catch((err) => {
          console.error(err);
          return res.status(500).json({ error: err.code });
      });
}

// Get 1 Reply
exports.getReply = (req, res) => {
    db.doc(`replies/${req.params.replyId}`).get()
      .then(doc => {
        if (!doc.exists) return res.status(404).json({ error: 'Reply not found'})
        return res.json(doc.data());
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      })
}

// Like a Reply
exports.likeReply = (req, res) => {
  const likeDocument = db.collection('likes').where('userId', '==', req.user.uid)
    .where('replyId', '==', req.params.replyId).limit(1);

  const replyDocument = db.doc(`/replies/${req.params.replyId}`);

  let replyData;
  replyDocument.get()
    .then(doc => {
      if (doc.exists) {
        replyData = doc.data();
        replyData.replyId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: 'Reply not found' });
      }
    })
    .then(data => {
      if (data.empty) {
        return db.collection('likes').add({
          replyId: req.params.replyId,
          userName: req.user.userName,
          userId: req.user.uid,
        })
        .then(() => {
          replyData.likeCount++;
          return replyDocument.update({ likeCount: replyData.likeCount });
        })
        .then(() => {
          return res.json(replyData);
        })
      } else {
        return res.status(400).json({ error: 'Reply already liked' });
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    })
};

// Unlike a Reply
exports.unlikeReply = (req, res) => {
  const likeDocument = db.collection('likes').where('userId', '==', req.user.uid)
  .where('replyId', '==', req.params.replyId).limit(1);

  const replyDocument = db.doc(`/replies/${req.params.replyId}`);

  let replyData;

  replyDocument.get()
    .then(doc => {
      if (doc.exists) {
        replyData = doc.data();
        replyData.replyId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: 'Reply not found' });
      }
    })
    .then(data => {
      if (data.empty) {
        return res.status(400).json({ error: 'Reply not liked' });
      } else {
        return db.doc(`/likes/${data.docs[0].id}`).delete()
          .then(() => {
            replyData.likeCount--;
            return replyDocument.update({ likeCount: replyData.likeCount });
          })
          .then(() => {
            res.json(replyData);
          })
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    })
}

// Delete Reply
exports.deleteReply = (req, res) => {
  const document = db.doc(`/replies/${req.params.replyId}`);
  let commentDocument;
  document.get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Reply not found'})
      }
      if (!req.user.isManager && doc.data().userId !== req.user.uid) {
        return res.status(403).json({ error: 'Unauthorized'});
      } else {
        commentDocument = db.doc(`comments/${doc.data().commentId}`);
        return commentDocument.get();
      }
    })
    .then((doc) => {
      return commentDocument.update({ replyCount: doc.data().replyCount - 1 });
    })
    .then(() => {
      return document.delete();
    })
    .then(() => {
      res.json({ message: 'Reply deleted successfully'});
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    })
}
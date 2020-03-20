const { db } = require('../util/admin');

exports.getAllTierLists = (req, res) => {
    db.collection("tierLists")
      .orderBy("name", "asc")
      .get()
      .then(data => {
        let tierLists = [];
        data.forEach(doc => {
          tierLists.push({
            tierListId: doc.id,
            ...doc.data()
          });
        });
        return res.json(tierLists);
      })
      .catch(err => console.error(err));
}

exports.postOneTierList = (req, res) => {
    const newTierList = {
      name: req.body.name,
      body: req.body.body,
      userName: req.user.userName,
      userId: req.user.uid,
      userImage: req.user.imageUrl,
      category: req.body.category,
      likeCount: 0,
      commentCount: 0,
    };
  
    db.collection("tierLists")
      .add(newTierList)
      .then(doc => {
        const resTierList = newTierList;
        resTierList.tierListId = doc.id;
        res.json(resTierList);
      })
      .catch(err => {
        res.status(500).json({ error: "Something went wrong" });
        console.log(err);
      });
}

// Get 1 Tier List
exports.getTierList = (req, res) => {
  let tierListData = {};
  db.doc(`tierLists/${req.params.tierListId}`).get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Tier List not found'})
      }
      tierListData = doc.data();
      tierListData.tierListId = doc.id;
      return db.collection('comments')
        .orderBy('createdAt', 'desc')
        .where('tierListId', '==', req.params.tierListId).get();
    })
    .then(data => {
      tierListData.comments = [];
      data.forEach(doc => {
        tierListData.comments.push(doc.data());
      });
      return res.json(tierListData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    })
}

// Comment on 1 Tier List
exports.commentOnTierList = (req, res) => {
  if (req.body.body.trim() === '') return res.status(400).json({ comment: 'Must not be empty'});

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    tierListId: req.params.tierListId,
    userName: req.user.userName,
    userId: req.user.uid,
    userImage: req.user.imageUrl,
    likeCount: 0,
    replyCount: 0,
  };

  db.doc(`tierLists/${req.params.tierListId}`).get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Tier List not found'})
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db.collection('comments').add(newComment);
    })
    .then((doc) => {
      const resComment = newComment;
      resComment.commentId = doc.id;
      return res.json(resComment);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: 'Something went wrong' });
    })
}

// Like a Tier List
exports.likeTierList = (req, res) => {
  const likeDocument = db.collection('likes').where('userId', '==', req.user.uid)
    .where('tierListId', '==', req.params.tierListId).limit(1);

  const tierListDocument = db.doc(`/tierLists/${req.params.tierListId}`);

  let tierListData;
  tierListDocument.get()
    .then(doc => {
      if (doc.exists) {
        tierListData = doc.data();
        tierListData.tierListId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: 'Tier List not found' });
      }
    })
    .then(data => {
      if (data.empty) {
        return db.doc(`/likes/${tierListData.tierListId}`).set({
          tierListId: req.params.tierListId,
          userName: req.user.userName,
          userId: req.user.uid,
        })
        .then(() => {
          tierListData.likeCount++;
          return tierListDocument.update({ likeCount: tierListData.likeCount });
        })
        .then(() => {
          return res.json(tierListData);
        })
      } else {
        return res.status(400).json({ error: 'Tier List already liked' });
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    })
};

// Unlike a Tier List
exports.unlikeTierList = (req, res) => {
  const likeDocument = db.collection('likes').where('userId', '==', req.user.uid)
  .where('tierListId', '==', req.params.tierListId).limit(1);

  const tierListDocument = db.doc(`/tierLists/${req.params.tierListId}`);

  let tierListData;

  tierListDocument.get()
    .then(doc => {
      if (doc.exists) {
        tierListData = doc.data();
        tierListData.tierListId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: 'Tier List not found' });
      }
    })
    .then(data => {
      if (data.empty) {
        return res.status(400).json({ error: 'Tier List not liked' });
      } else {
        return db.doc(`/likes/${data.docs[0].id}`).delete()
          .then(() => {
            tierListData.likeCount--;
            return tierListDocument.update({ likeCount: tierListData.likeCount });
          })
          .then(() => {
            res.json(tierListData);
          })
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    })
}

// Delete Tier List
exports.deleteTierList = (req, res) => {
  const document = db.doc(`/tierLists/${req.params.tierListId}`);
  document.get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Tier List not found'})
      }
      if (doc.data().userId !== req.user.uid) {
        return res.status(403).json({ error: 'Unauthorized'});
      } else {
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: 'Tier List deleted successfully'});
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    })
}
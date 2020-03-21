const { db } = require('../util/admin');

exports.getAllTierItems = (req, res) => {
    db.collection("tierItems")
      .orderBy("name", "asc")
      .get()
      .then(data => {
        let tierItems = [];
        data.forEach(doc => {
            tierItems.push({
            tierItemId: doc.id,
            ...doc.data()
          });
        });
        return res.json(tierItems);
      })
      .catch(err => console.error(err));
}

exports.postOneTierItem = (req, res) => {
  const updateTierItem = {
    name: req.body.name,
    imageUrl: req.body.imageUrl,
    category: req.body.category.toUpperCase(),
    userId: req.user.uid,
  };
  return db.collection('categories').where('name', '==', updateTierItem.category).limit(1).get()
    .then(data => {
      if (data.empty) {
        return res.status(404).json({ error: 'Category not found' });
      }
      db.collection("tierItems")
        .add(updateTierItem)
        .then(doc => {
          updateTierItem.tierItemId = doc.id;
          return res.json(updateTierItem);
        })
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: "Something went wrong" });
    });
}

// Get 1 Tier Item
exports.getTierItem = (req, res) => {
  let tierItemData = {};
  db.doc(`tierLists/${req.params.tierItemId}`).get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Tier Item not found'})
      }
      tierItemData = doc.data();
      tierItemData.tierItemId = doc.id;
      return res.json(tierItemData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    })
}

// Delete Tier Item
exports.deleteTierItem = (req, res) => {
  const document = db.doc(`/tierItems/${req.params.tierItemId}`);
  document.get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Tier Item not found'})
      }
      if (!req.user.isManager) {
        return res.status(403).json({ error: 'Unauthorized'});
      } else {
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: 'Tier Item deleted successfully'});
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    })
}

// Update Tier Item
exports.updateTierItem = (req, res) => {
  const document = db.doc(`/tierItems/${req.params.tierItemId}`);
  const updateTierItem = {
    name: req.body.name,
    imageUrl: req.body.imageUrl,
    category: req.body.category.toUpperCase(),
    userId: req.user.uid,
  }
  document.get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Tier Item not found'})
      }
      if (!req.user.isManager && doc.data().userId !== req.user.uid) {
        return res.status(403).json({ error: 'Unauthorized'});
      } else {
        return document.update(updateTierItem);
      }
    })
    .then(() => {
      res.json({ message: 'Tier Item updated successfully'});
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    })
}
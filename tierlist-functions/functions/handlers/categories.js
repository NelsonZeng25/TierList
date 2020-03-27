const { db } = require('../util/admin');

exports.getAllCategories = (req, res) => {
    db.collection("categories")
      .orderBy("name", "asc")
      .get()
      .then(data => {
        let categories = [];
        data.forEach(doc => {
            categories.push({
            categoryId: doc.id,
            ...doc.data()
          });
        });
        return res.json(categories);
      })
      .catch(err => console.error(err));
}

exports.getAllCategoriesWithTierLists = (req, res) => {
  let categories = {};
  let tierLists;
  let tierListData;
  db.collection("categories")
      .orderBy("name", "asc")
      .get()
      .then(data => {
        data.forEach(doc => {
          categories[doc.data().name] = [];
        });
        return db.collection('tierLists').get();
      })
      .then(data => {
        data.forEach(doc => {
          for (var name in categories) {
            if (doc.data().category === name) {
              tierListData = doc.data();
              tierListData.tierListId = doc.id;
              tierLists = categories[name];
              tierLists.push(tierListData);
              categories[name] = tierLists;
              break;
            }
          }
        });
        return res.json(categories);
      })
      .catch(err => console.error(err))
}

exports.getAllCategoriesWithTierListsForUser = (req, res) => {
  let categories = {};
  let tierListData;
  db.collection('tierLists').where('userId', '==', req.params.userId).get()
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
      Object.keys(categories).sort().forEach(function(key) {
        ordered[key] = categories[key];
      });
      return res.json(ordered);
    })
    .catch(err => console.error(err))
}

// Get Tier Items for 1 category
exports.getTierItemsForOneCategory = (req, res) => {
  let tierItemData = {};
  let tierItems = [];
  db.collection('tierItems').where('category', '==', req.params.category).get()
    .then(data => {
      data.forEach(doc => {
        if (doc.exists) {
          tierItemData = doc.data();
          tierItemData.id = doc.id;
          tierItems.push(tierItemData);
        }
      });
      return res.json(tierItems);
    })
    .catch(err => console.error(err))
}

// Get 1 Category
exports.getCategory = (req, res) => {
    let categoryData = {};
    db.doc(`categories/${req.params.categoryId}`).get()
      .then(doc => {
        if (!doc.exists) {
          return res.status(404).json({ error: 'Category not found'})
        }
        categoryData = doc.data();
        categoryData.categoryId = doc.id;
        return res.json(categoryData);
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      })
  }

exports.postOneCategory = (req, res) => {
  if (req.body.name.trim() === '') return res.status(400).json({ name: 'Must not be empty'});

  const updateCategory = {
    name: req.body.name.toUpperCase()
  };
  db.collection('categories').where('name', '==', updateCategory.name).limit(1).get()
    .then(data => {
      if (updateCategory.name.trim() === '') {
        return res.status(400).json({ error: 'Cannot have empty category'});
      } else if (data.empty) {
        return db.collection('categories').add(updateCategory)
          .then(doc => {
            updateCategory.categoryId = doc.id;
            return res.json(updateCategory)
          })
      } else {
        return res.status(400).json({ error: 'Category already added '});
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
}

exports.deleteCategory = (req, res) => {
  const document = db.doc(`/categories/${req.params.categoryId}`);
  document.get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Category not found" });
      }
      if (!req.user.isManager) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        document.delete();
        return res.json({ message: "Category deleted successfully" });
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// Update Category
exports.updateCategory = (req, res) => {
  const document = db.doc(`/categories/${req.params.categoryId}`);
  const updateCategory = {
    name: req.body.name.toUpperCase(),
  }
  document.get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Category not found'})
      }
      if (!req.user.isManager) {
        return res.status(403).json({ error: 'Unauthorized'});
      } else {
        return document.update(updateCategory);
      }
    })
    .then(() => {
      res.json({ message: 'Category updated successfully'});
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    })
}
import { db } from '../util/admin.js';

export function getAllCategories(req, res) {
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

export function getAllCategoriesWithTierLists(req, res) {
  let categories = {};
  let tierListData;
  db.collection("categories")
      .orderBy("name", "asc")
      .get()
      .then(data => {
        data.forEach(doc => {
          categories[doc.data().name] = [];
        });
        return db.collection('tierLists').orderBy("likeCount", "desc").get();
      })
      .then(data => {
        data.forEach(doc => {
            tierListData = doc.data();
            tierListData.tierListId = doc.id;
            categories[tierListData.category].push(tierListData);
        });
        return res.json(categories);
      })
      .catch(err => console.error(err))
}

export function getAllCategoriesWithTierListsForUser(req, res) {
  let categories = {};
  let tierListData;
  db.collection('tierLists').orderBy("name", "asc").where('userId', '==', req.params.userId).get()
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
export function getTierItemsForOneCategory(req, res) {
  let tierItemData = {};
  let tierItems = [];
  db.collection('tierItems').orderBy("name", "asc").where('category', '==', req.params.category).get()
    .then(data => {
      data.forEach(doc => {
        if (doc.exists) {
          tierItemData = doc.data();
          tierItemData.tierItemId = doc.id;
          tierItems.push(tierItemData);
        }
      });
      return res.json(tierItems);
    })
    .catch(err => console.error(err))
}

// Get 1 Category
export function getCategory(req, res) {
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

export function postOneCategory(req, res) {
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

export function deleteCategory(req, res) {
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
}

// Update Category
export function updateCategory(req, res) {
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
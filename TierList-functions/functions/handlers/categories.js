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
  const newCategory = {
    name: req.body.name
  };
  db.collection("categories")
    .add(newCategory)
    .then(doc => {
      newCategory.categoryId = doc.id;
      return res.json(newCategory);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

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
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: "Category deleted successfully" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};


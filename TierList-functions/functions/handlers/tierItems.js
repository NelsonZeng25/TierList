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
const { db } = require('../util/admin');

exports.getAllManagers = (req, res) => {
    db.collection("managers")
      .orderBy("userName", "asc")
      .get()
      .then(data => {
        let managers = [];
        data.forEach(doc => {
            managers.push({
            userId: doc.id,
            ...doc.data()
          });
        });
        return res.json(managers);
      })
      .catch(err => console.error(err));
}

exports.postOneManager = (req, res) => {
    if (req.user.isManager) {
        const newManager = {
            userId: req.body.userId,
            userName: req.body.userName,
            userImage: req.body.userImage,
            email: req.body.email,
        }
        db.doc(`/managers/${newManager.userId}`).set({
                ...newManager,
            })
            .then(() => {
                return res.json(newManager);
            })
            .catch(err => {
                console.error(err);
                return res.status(500).json({ error: err.code });
            })
    } else {
        return res.status(403).json({ error: 'Unauthorized' });
    }
}

exports.deleteManager = (req, res) => {
  const document = db.doc(`/managers/${req.params.managerId}`);
  document.get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Manager not found" });
      }
      if (!req.user.isOwner) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: "Manager deleted successfully" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};


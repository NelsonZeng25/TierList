const { admin, db } = require("../util/admin");

const config = require("../util/config");

const noImg = "no-img.png";

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
};

exports.postOneTierItem = (req, res) => {
  const updateTierItem = {
    name: req.body.name,
    imageUrl: req.body.imageUrl,
    category: req.body.category.toUpperCase(),
    userId: req.user.uid
  };
  if (updateTierItem.name.trim() === '') return res.status(400).json({ name: "Must not be empty" });
  return db
    .collection("categories")
    .where("name", "==", updateTierItem.category)
    .limit(1)
    .get()
    .then(data => {
      if (data.empty) {
        return res.status(404).json({ category: "Category not found" });
      }
      db.collection("tierItems")
        .add(updateTierItem)
        .then(doc => {
          updateTierItem.tierItemId = doc.id;
          return res.json(updateTierItem);
        });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: "Something went wrong" });
    });
};

// Upload an image for the Tier Item
exports.uploadTierItemImage = (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName;
  let imageToBeUploaded = {};

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Wrong file type submitted" });
    }
    const imageExtension = filename.split(".")[filename.split(".").length - 1];
    const imgName = new Date().getTime();
    imageFileName = `${req.user.uid}_${imgName}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", () => {
    const destinationData = `tierItemImages/${imageFileName}`;
    admin
      .storage()
      .bucket(config.storageBucket)
      .upload(imageToBeUploaded.filepath, {
        destination: destinationData,
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype
          }
        }
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/tierItemImages%2F${imageFileName}?alt=media`;
        return res.json({ 
          imageUrl,
          message: "Image uploaded succesfully" 
        });
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  });
  busboy.end(req.rawBody);
};

// Get 1 Tier Item
exports.getTierItem = (req, res) => {
  db.doc(`tierItems/${req.params.tierItemId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Tier Item not found" });
      }
      return res.json(doc.data());
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// Delete Tier Item
exports.deleteTierItem = (req, res) => {
  const document = db.doc(`/tierItems/${req.params.tierItemId}`);
  document
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Tier Item not found" });
      } else if (!req.user.isManager) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        document.delete();
        return res.json({ message: "Tier Item deleted successfully" });
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// Update Tier Item
exports.updateTierItem = (req, res) => {
  const document = db.doc(`/tierItems/${req.params.tierItemId}`);
  const updateTierItem = {
    name: req.body.name,
    imageUrl: req.body.imageUrl,
    userId: req.user.uid
  };
  if (req.body.name.trim() === '') return res.status(400).json({ name: 'Must not be empty'});
  document
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Tier Item not found" });
      }
      if (!req.user.isManager && doc.data().userId !== req.user.uid) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        updateTierItem.tierItemId = doc.id;
        updateTierItem.category = doc.data().category;
        return document.update(updateTierItem);
      }
    })
    .then(() => {
      return res.json({ 
        tierItem: updateTierItem,
        message: "Tier Item updated successfully" 
      });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

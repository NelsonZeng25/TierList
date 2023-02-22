import { admin, db } from './admin.js';

// Checks if the user is logged in
// This method is used as a middleware for methods that require user to be logged in
export default (req, res, next) => {
    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
        console.error('No token found');
        return res.status(403).json({ error: 'Unauthorized' });
    }

    admin.auth().verifyIdToken(idToken)
        .then(decodedToken => {
            req.user = decodedToken;
            // console.log(decodedToken);
            return db.collection('managers')
                .where('userId', '==', req.user.uid)
                .limit(1)
                .get()
        })
        .then(data => {
            req.user.isOwner = false;
            if (!data.empty) {
                if (data.docs[0].data().email === 'nelson.zeng25@gmail.com')    // Check if it's the Owner!
                    req.user.isOwner = true;
                req.user.isManager = true;
            } else { 
                req.user.isManager = false;
            }

            return db.collection('users')
                .where('userId', '==', req.user.uid)
                .limit(1)
                .get();
        })
        .then(data => {
            req.user.userName = data.docs[0].data().userName;
            req.user.imageUrl = data.docs[0].data().imageUrl;
            return next();
        })
        .catch(err => {
            console.error('Error while verifying token', err);
            return res.status(403).json(err);
        })
}
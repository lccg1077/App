const admin = require('firebase-admin');
const serviceAccount = require('./appchatbot-90dbd-firebase-adminsdk-fbsvc-5c9d79e727.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://appchatbot-90dbd.firebaseio.com'
});

module.exports = admin;

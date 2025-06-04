const admin = require('./firebaseAdmin');

async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) return res.status(401).send('Token requerido');

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(403).send('Token inválido');
  }
}

module.exports = verifyToken;

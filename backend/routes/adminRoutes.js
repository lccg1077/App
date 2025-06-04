const express = require('express');
const router = express.Router();
const verifyToken = require('../getUser');
const checkAdmin = require('../middlewares/checkAdmin');

// Simulamos colección en Firestore (puedes cambiar por estudiantes, tareas, etc.)
const admin = require('../firebaseAdmin');
const db = admin.firestore();
const ref = db.collection('datos');

router.use(verifyToken, checkAdmin);

// CREATE
router.post('/', async (req, res) => {
  const data = req.body;
  const docRef = await ref.add(data);
  res.send({ id: docRef.id, ...data });
});

// READ
router.get('/', async (req, res) => {
  const snapshot = await ref.get();
  const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.send(items);
});

// UPDATE
router.put('/:id', async (req, res) => {
  await ref.doc(req.params.id).update(req.body);
  res.send({ message: 'Actualizado' });
});

// DELETE
router.delete('/:id', async (req, res) => {
  await ref.doc(req.params.id).delete();
  res.send({ message: 'Eliminado' });
});

module.exports = router;

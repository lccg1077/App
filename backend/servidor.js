const express = require('express');
const app = express();
const adminRoutes = require('./routes/adminRoutes');

app.use(express.json());
app.use('/admin', adminRoutes);

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));

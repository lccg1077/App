const express = require('express');
const app = express();
const adminRoutes = require('./routes/adminRoutes');

app.use(express.json());
app.use('/admin', adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
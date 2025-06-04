const serverless = require('serverless-http');
const express = require('express');
const app = express();

const cors = require('cors');
const userRoutes = require('../../backend/funciones/getUser'); // puedes incluir todos aquí

app.use(cors());
app.use(express.json());
app.use('/user', userRoutes);

module.exports.handler = serverless(app);

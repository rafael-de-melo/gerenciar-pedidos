require('dotenv').config();

const express = require('express');
const app = express();
const orderRoutes = require('./src/routes/orderRoutes');

app.use(express.json());
app.use(orderRoutes);

app.get('/', (req, res) => {
  res.send('API rodando');
});

const port = process.env.APP_PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});
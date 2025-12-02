require('dotenv').config();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./src/config/swagger');
const express = require('express');
const app = express();
const orderRoutes = require('./src/routes/orderRoutes');

app.use(express.json());
app.use(orderRoutes);

app.get('/', (req, res) => {
  res.send('API rodando');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.APP_PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});
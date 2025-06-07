const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/auth');
const publicRoutes = require('./routes/public');
const privateRoutes = require('./routes/private');
const productRoutes = require('./routes/products');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml'); 


const app = express();

app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true,
  }));
app.use(morgan('dev'));
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/auth', authRoutes);
app.use('/api', publicRoutes);
app.use('/api/private', privateRoutes); 
app.use('/products', productRoutes);

module.exports = app;

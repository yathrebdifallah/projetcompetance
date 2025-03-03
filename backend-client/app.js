require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');


// Import des routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Connexion à la base de données
connectDB();

const app = express();

// Middleware global
app.use(cors());
app.use(express.json()); // Body parser

// Définition des routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));


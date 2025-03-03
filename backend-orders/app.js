const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/orders', orderRoutes);

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connecté pour le service des commandes'))
  .catch((err) => console.log('Erreur MongoDB :', err));

// Démarrer le serveur
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Serveur en cours d'exécution sur le port ${PORT}`));
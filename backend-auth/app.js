const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { router: authRoutes } = require('./routes/authRoutes'); // Importez le routeur
require('dotenv').config();
console.log(process.env.JWT_SECRET_KEY); // Vérifiez si la clé est bien définie

const app = express(); // Déclarez l'app avant de l'utiliser

const port = 5000; // Utilisez 5000 ou un autre port que vous préférez

// Middleware et routes
app.use(cors());
app.use(bodyParser.json());
app.use('/api/auth', authRoutes); // Utilisez les routes d'authentification

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connecté'))
  .catch((err) => console.error('Erreur de connexion à MongoDB :', err));

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

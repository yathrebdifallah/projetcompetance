const express = require('express');
const app = express();
const port = 5000;

// Middleware pour parser les données JSON
app.use(express.json());

// Route de test
app.get('/', (req, res) => {
  res.send('Bienvenue sur l\'API Catalog Services!');
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});

// authRoutes.js

const express = require('express');
const router = express.Router();
const { signupController, loginController } = require('../controllers/authControllers'); // Import des contrôleurs

// Route pour l'inscription des utilisateurs
  
  router.post('/signup', (req, res) => {
    // Simule une logique d'inscription
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send('Email et mot de passe sont requis.');
    }
  
    res.status(200).send('Inscription réussie !');
  });

// Route pour la connexion des utilisateurs
router.post('/login', (req, res) => {
    // Simule une logique d'login
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send('Email et mot de passe sont requis.');
    }
  
    res.status(200).send('login réussie !');
  });

module.exports = router;
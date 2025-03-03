const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Assurez-vous que le chemin est correct
require('dotenv').config(); // Charge les variables d'environnement depuis le fichier .env

const router = express.Router();

// Middleware d'autorisation
const authMiddleware = (roles) => (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Non autorisé' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Utilisez ici la variable d'environnement
    if (roles && !roles.includes(decoded.role)) {
      return res.status(403).json({ error: 'Permission refusée' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token invalide' });
  }
};

// Inscription de l'utilisateur
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe sont requis.' });
  }
  try {
    console.log('Données reçues :', { email, password });
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Un utilisateur avec cet email existe déjà.' });
    }
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Mot de passe haché :', hashedPassword);

    // Création de l'utilisateur avec un rôle par défaut
    const newUser = new User({ email, password: hashedPassword, role: 'user' });
    await newUser.save();
    console.log('Utilisateur enregistré avec succès.');
    res.status(201).json({ message: 'Inscription réussie !' });
  } catch (err) {
    console.error('Erreur lors de l’inscription :', err);
    res.status(500).json({ error: 'Erreur lors de l’inscription.', details: err.message });
  }
});

// Connexion de l'utilisateur
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe sont requis.' });
  }
  try {
    console.log('Tentative de connexion pour :', email);

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    // Vérifier si le mot de passe est correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Mot de passe incorrect.' });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET_KEY,  // Utilisation de la clé secrète provenant du fichier .env
      { expiresIn: '1h' }
    );
    
    res.status(200).json({ message: 'Connexion réussie !', token });
  } catch (err) {
    console.error('Erreur lors de la connexion :', err.message);
    res.status(500).json({ error: 'Erreur lors de la connexion.', details: err.message });
  }
});

// Route protégée
router.get('/protected', authMiddleware(['admin']), (req, res) => {
  res.status(200).json({ message: 'Accès autorisé uniquement aux administrateurs!' });
});

module.exports = { router, authMiddleware };

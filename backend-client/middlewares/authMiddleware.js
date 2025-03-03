// authMiddleware.js

const jwt = require('jsonwebtoken');

// Middleware pour vérifier si un utilisateur est authentifié
exports.isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Récupérer le token du header Authorization

  if (!token) {
    return res.status(401).json({ error: 'Accès refusé, aucun token fourni.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Décoder le token
    req.user = decoded; // Attacher les informations utilisateur à l'objet req
    next(); // Passer au middleware ou à la route suivante
  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error);
    res.status(401).json({ error: 'Token invalide ou expiré.' });
  }
};

// Middleware pour vérifier si l'utilisateur est un administrateur
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // L'utilisateur est un administrateur, continuer
  } else {
    res.status(403).json({ error: 'Accès refusé, privilèges insuffisants.' });
  }
};

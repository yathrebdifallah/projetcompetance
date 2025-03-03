// orderRoutes.js

const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/authMiddleware');
const {
  createOrder,
  getUserOrders,
  addToCart,
  getCart,
  removeFromCart,
} = require('../controllers/orderControllers');

// Ajouter un produit au panier
router.post('/cart', isAuthenticated, addToCart);

// Récupérer le panier actif
router.get('/cart', isAuthenticated, getCart);

// Supprimer un produit du panier
router.delete('/cart', isAuthenticated, removeFromCart);

// Créer une nouvelle commande
router.post('/', isAuthenticated, createOrder);

// Récupérer les commandes de l'utilisateur
router.get('/', isAuthenticated, getUserOrders);

module.exports = router;

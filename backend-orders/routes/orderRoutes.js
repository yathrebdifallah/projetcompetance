const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const jwt = require('jsonwebtoken');

// Middleware pour vérifier le JWT
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send({ error: 'Accès non autorisé' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send({ error: 'Token invalide' });
  }
};

// Ajouter un produit au panier
router.post('/cart', authMiddleware, async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let order = await Order.findOne({ userId: req.user.id, status: 'cart' });
    if (!order) {
      order = new Order({ userId: req.user.id, products: [] });
    }

    const productIndex = order.products.findIndex((p) => p.productId === productId);
    if (productIndex > -1) {
      order.products[productIndex].quantity += quantity;
    } else {
      order.products.push({ productId, quantity });
    }

    await order.save();
    res.status(200).send(order);
  } catch (err) {
    res.status(500).send({ error: 'Erreur lors de l’ajout au panier' });
  }
});

// Passer une commande
router.post('/checkout', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({ userId: req.user.id, status: 'cart' });
    if (!order) return res.status(400).send({ error: 'Panier vide' });

    order.status = 'completed';
    order.totalPrice = order.products.reduce((total, product) => total + product.quantity * 10, 0); // Exemple de calcul
    await order.save();

    res.status(200).send(order);
  } catch (err) {
    res.status(500).send({ error: 'Erreur lors du passage de la commande' });
  }
});

// Historique des commandes
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id, status: 'completed' });
    res.status(200).send(orders);
  } catch (err) {
    res.status(500).send({ error: 'Erreur lors de la récupération des commandes' });
  }
});

module.exports = router;
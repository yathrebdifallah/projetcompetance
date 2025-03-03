const express = require('express');
const { getProducts, createProduct } = require('../controllers/productControllers');
const router = express.Router();

// Récupérer tous les produits
router.get('/', getProducts);

// Créer un produit (accessible uniquement aux administrateurs)
router.post('/', createProduct);


// Exemple de produits
const products = [
    { id: 1, name: 'Produit A', price: 10 },
    { id: 2, name: 'Produit B', price: 15 },
  ];

// GET /api/products - Récupérer tous les produits
router.get('/', (req, res) => {
  res.status(200).json(products);
});

module.exports = router;



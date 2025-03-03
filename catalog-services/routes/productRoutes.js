const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Route pour ajouter un produit (seulement pour l'admin)
router.post('/products', productController.createProduct);

// Route pour mettre à jour un produit (seulement pour l'admin)
router.put('/products/:id', productController.updateProduct);

// Route pour supprimer un produit (seulement pour l'admin)
router.delete('/products/:id', productController.deleteProduct);

// Route pour afficher tous les produits
router.get('/products', productController.getProducts);

module.exports = router;

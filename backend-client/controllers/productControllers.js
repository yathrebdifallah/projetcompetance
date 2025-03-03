const Product = require('../models/product');

// Récupérer tous les produits depuis la base de données
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Créer un nouveau produit dans la base de données
exports.createProduct = async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: 'Nom et prix sont requis' });
    }

    const product = new Product({ name, price });
    await product.save();
    res.status(201).json({ message: 'Produit créé', product });
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    res.status(400).json({ error: 'Erreur lors de la création du produit' });
  }
};

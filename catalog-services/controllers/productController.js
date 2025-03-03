const Product = require('../models/product');

// Fonction pour créer un produit
const createProduct = async (req, res) => {
  const { name, description, price, category, imageUrl } = req.body;
  
  try {
    const newProduct = new Product({ name, description, price, category, imageUrl });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du produit', error: error.message });
  }
};

// Fonction pour mettre à jour un produit
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, imageUrl } = req.body;
  
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, { name, description, price, category, imageUrl }, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du produit', error: error.message });
  }
};

// Fonction pour supprimer un produit
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    res.status(200).json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du produit', error: error.message });
  }
};

// Fonction pour afficher tous les produits
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des produits', error: error.message });
  }
};

module.exports = { createProduct, updateProduct, deleteProduct, getProducts };

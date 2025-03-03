// orderController.js

const Order = require('../models/order');
const Product = require('../models/product');

// Créer une nouvelle commande
exports.createOrder = async (req, res) => {
  const { products, total } = req.body;

  try {
    const order = await Order.create({
      userId: req.user.id, // Utilisateur connecté
      products,
      total,
      status: 'Pending', // Statut par défaut
    });

    res.status(201).json({ message: 'Commande créée avec succès', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création de la commande' });
  }
};

// Récupérer toutes les commandes d'un utilisateur
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }); // Rechercher par utilisateur
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
  }
};

// Ajouter un produit au panier
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    // Vérifier si un panier "actif" existe pour cet utilisateur
    let order = await Order.findOne({ userId: req.user.id, status: 'Pending' });

    // Si aucun panier n'existe, en créer un
    if (!order) {
      order = await Order.create({
        userId: req.user.id,
        products: [{ productId, quantity }],
        total: 0,
        status: 'Pending',
      });
    } else {
      // Ajouter ou mettre à jour le produit dans le panier existant
      const productIndex = order.products.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (productIndex > -1) {
        // Produit déjà dans le panier, mettre à jour la quantité
        order.products[productIndex].quantity += quantity;
      } else {
        // Nouveau produit, ajouter au panier
        order.products.push({ productId, quantity });
      }
    }

    // Recalculer le total
    const productDetails = await Product.findById(productId);
    order.total += productDetails.price * quantity;

    // Sauvegarder les modifications
    await order.save();

    res.status(200).json({ message: 'Produit ajouté au panier', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l’ajout au panier' });
  }
};

// Récupérer le panier actif
exports.getCart = async (req, res) => {
  try {
    const cart = await Order.findOne({ userId: req.user.id, status: 'Pending' })
      .populate('products.productId', 'name price');
    if (!cart) return res.status(404).json({ message: 'Panier vide' });
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération du panier' });
  }
};

// Supprimer un produit du panier
exports.removeFromCart = async (req, res) => {
  const { productId } = req.body;

  try {
    let order = await Order.findOne({ userId: req.user.id, status: 'Pending' });
    if (!order) return res.status(404).json({ message: 'Panier introuvable' });

    order.products = order.products.filter(
      (item) => item.productId.toString() !== productId
    );

    // Recalculer le total
    const productDetails = await Product.findById(productId);
    order.total -= productDetails.price;

    // Sauvegarder
    await order.save();

    res.status(200).json({ message: 'Produit supprimé du panier', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la suppression du produit' });
  }
};

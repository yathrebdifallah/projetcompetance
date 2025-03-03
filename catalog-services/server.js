const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/product"); // Vérifie que le fichier "product.js" existe dans "models/"

const app = express();
app.use(express.json()); // Middleware pour parser les requêtes JSON

// Connexion à MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/catalog-db")
    .then(() => console.log("✅ Base de données MongoDB connectée"))
    .catch(err => console.error("❌ Erreur de connexion à MongoDB:", err));

// 🔹 Ajouter un produit
app.post("/api/products", async (req, res) => {
    try {
        const { name, price, category } = req.body;

        if (!name || !price || !category) {
            return res.status(400).json({ message: "❌ Tous les champs sont obligatoires !" });
        }

        if (price <= 0) {
            return res.status(400).json({ message: "❌ Le prix doit être un nombre positif !" });
        }

        const newProduct = new Product({ name, price, category });
        await newProduct.save();

        res.status(201).json({ message: "✅ Produit ajouté avec succès", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "❌ Erreur lors de l'ajout du produit", error: error.message });
    }
});

// 🔹 Récupérer tous les produits
app.get("/api/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ message: "✅ Liste des produits", products });
    } catch (error) {
        res.status(500).json({ message: "❌ Erreur lors de la récupération des produits", error: error.message });
    }
});

// 🔹 Récupérer un produit par ID
app.get("/api/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "❌ Produit non trouvé" });
        }

        res.json({ message: "✅ Produit trouvé", product });
    } catch (error) {
        res.status(500).json({ message: "❌ Erreur lors de la récupération du produit", error: error.message });
    }
});

// 🔹 Mettre à jour un produit
app.put("/api/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, category } = req.body;

        if (!name || !price || !category) {
            return res.status(400).json({ message: "❌ Tous les champs sont obligatoires !" });
        }

        if (price <= 0) {
            return res.status(400).json({ message: "❌ Le prix doit être un nombre positif !" });
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, { name, price, category }, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: "❌ Produit non trouvé" });
        }

        res.status(200).json({ message: "✅ Produit mis à jour avec succès", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "❌ Erreur lors de la mise à jour du produit", error: error.message });
    }
});

// 🔹 Supprimer un produit
app.delete("/api/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "❌ Produit non trouvé" });
        }

        res.status(200).json({ message: "✅ Produit supprimé avec succès", product: deletedProduct });
    } catch (error) {
        res.status(500).json({ message: "❌ Erreur lors de la suppression du produit", error: error.message });
    }
});

// Démarrer le serveur
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`));

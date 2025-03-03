const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // Connexion simple
    console.log('MongoDB connecté :', mongoose.connection.host);
  } catch (error) {
    console.error('Erreur de connexion à MongoDB :', error.message);
    process.exit(1); // Arrête l'exécution si une erreur survient
  }
};

module.exports = connectDB;


const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Empêche les doublons dans la base de données
  },
  password: {
    type: String,
    required: true, // Assure que le mot de passe est fourni
  },
  role: {
    type: String,
    enum: ['client', 'admin'], // Limite les valeurs possibles
    default: 'client',
  },
});

module.exports = mongoose.model('User', userSchema);

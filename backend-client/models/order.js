const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 },
    },
  ],
  total: { type: Number, required: true, default: 0 },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Completed', 'Cancelled'] },
});

module.exports = mongoose.model('Order', OrderSchema);

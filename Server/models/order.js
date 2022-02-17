const { Schema, model, Types } = require('mongoose');

const orderSchema = new Schema({
  products: [
    {
      product: {
        type: Object,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  user: {
    type: Types.ObjectId,
    required: true,
  },
});

module.exports = model('Order', orderSchema);

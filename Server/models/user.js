const { Schema, model, Types } = require('mongoose');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: String,
  cart: {
    items: [
      {
        productId: {
          type: Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
  admin: Boolean,
});

userSchema.methods.addToCart = function (productId) {
  const cartProductIndex = this.cart.items.findIndex(
    cp => cp.productId.toString() === productId.toString()
  );

  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId,
      quantity: newQuantity,
    });
  }

  const updatedCart = {
    items: updatedCartItems,
  };

  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function (prodId) {
  const cartProductIndex = this.cart.items.findIndex(
    cp => cp.productId.toString() === prodId.toString()
  );

  let updatedCartItems = [...this.cart.items];

  if (this.cart.items[cartProductIndex].quantity > 1) {
    const newQuantity = updatedCartItems[cartProductIndex].quantity - 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems = updatedCartItems.filter(
      cp => cp.productId.toString() !== prodId.toString()
    );
  }
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.removeProductFromCart = function (prodId) {
  const updatedCartItems = this.cart.items.filter(
    cartItem => cartItem.productId.toString() !== prodId.toString()
  );
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = model('User', userSchema);

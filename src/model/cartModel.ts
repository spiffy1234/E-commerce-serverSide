import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "necessary"],
        unique: [true, "Duplicate product"],
      },

      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

export default Cart;

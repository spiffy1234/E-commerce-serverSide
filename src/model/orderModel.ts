import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  orderStatus: {
    type: String,
    // required: true,
  },
  trackingNumber: {
    type: String,
  },
  paymentDetails: {
    paymentMethod: {
      type: String,
      required: true,
    },
    cardNumber: {
      type: String,
    },
  },
  shippingAddress: {
    name: {
      type: String,
    },
    street1: {
      type: String,
    },
    street2: {
      type: String,
    },
    landmark: {
      type: String,
    },
    city: {
      type: String,
    },
    states: {
      type: String,
    },
    country: {
      type: String,
    },
    pincode: {
      type: String,
    },
  },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;

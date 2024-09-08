import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  images: {
    type: [String],
  },
  brand: {
    type: String,
  },
  title: {
    type: String,
    required: [true, "necessary"],
  },
  description: {
    type: String,
    required: [true, "necessary"],
  },
  price: {
    type: Number,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  stock: {
    type: Number,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;

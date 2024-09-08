import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  street1: { type: String },
  street2: { type: String },
  landmark: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  country: { type: String },
});

const Address =
  mongoose.models.Address || mongoose.model("Address", addressSchema);

export default Address;

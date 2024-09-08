import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "Must provide firstname"],
    },
    lastname: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: [true, "Necessary"],
      unique: [true, "Email already exist"],
    },
    password: {
      type: String,
      required: [true, "Necessary"],
    },
    mobile: {
      type: String,
      required: [true, "Its must required"],
    },
    address: {
      street1: { type: String },
      street2: { type: String },
      landmark: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
      country: { type: String },
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "Address",
      // required: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

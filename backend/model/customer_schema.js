const mongoose = require("mongoose");

const customer = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone_number: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    minlength: 3,
  },
  profileImage: {
    imageUrl: { type: String, default: "" },
    publicId: { type: String, default: "" },
  },
  area: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  pincode: {
    type: Number,
    default: "",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isVaryfied: {
    type: Boolean,
    default: false,
  },
});

const customer_detail = mongoose.model("customer_detail", customer);

module.exports = customer_detail;

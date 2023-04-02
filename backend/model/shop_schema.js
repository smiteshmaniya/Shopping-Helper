const mongoose = require("mongoose");

const shop_schema = new mongoose.Schema({
  shop_name: {
    type: String,
    required: true,
  },
  profileImage: {
    imageUrl: { type: String, default: "" },
    publicId: { type: String, default: "" },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
    unique: true,
  },
  owner_name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    minlength: 3,
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
  start_time: {
    type: String,
    required: true,
  },
  end_time: {
    type: String,
    required: true,
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

const shop_detail = mongoose.model("shop_detail", shop_schema);

module.exports = shop_detail;

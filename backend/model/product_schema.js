const mongoose = require("mongoose");

const product_schema = mongoose.Schema({
  shop_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "shop_detail",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  stock: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: [
    {
      imageUrl: {
        type: String,
      },
      publicId: {
        type: String,
      },
    },
  ],
  tags: [{ type: String }],
});

const product_detail = mongoose.model("product_detail", product_schema);

module.exports = product_detail;

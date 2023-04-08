const express = require("express");
const routes = express.Router();
const shop_detail = require("./shop_detail/index.shop_detail");
const product_details = require("./product_detail/index.product_details");
const customer_details = require("./customer_detail/index.customer_details");
const cart_details = require("./cart_detail/index.cart_detail");
const order_details = require("./order_detail/index.order_details");

routes.get("/", (req, res) => {
  res.status(200).send("Hello! Api is working fine...");
});

routes.use("/", shop_detail);
routes.use("/", product_details);
routes.use("/", customer_details);
routes.use("/", order_details);
routes.use("/", cart_details);

module.exports = routes;

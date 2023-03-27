const express = require("express");
const AuthenticateShop = require("../../middleware/AuthenticateShop");
const routes = express.Router();
const {
  register_shop_controller,
  all_shops_controller,
  update_shop_controller,
  delete_shop_controller,
  login_shop_controller,
  delete_all,
  logout_shop_controller,
  search_shop_controller,
  shop_register_verify,
  shopkeeper_forgot_password,
  shopkeeper_forgot_verify_password,
} = require("../../controllers/shop.controller");

routes.post("/shop_register", register_shop_controller);
routes.get("/shopRegister/verify/:token", shop_register_verify);
routes.post("/shopkeeper/forgot", shopkeeper_forgot_password);
routes.post(
  "/shopkeeper/forgot/verifypassword",
  shopkeeper_forgot_verify_password
);

routes.get("/shop_register", all_shops_controller);

// routes.get('/shop_register', AuthenticateShop, one_shop_controller);

routes.put("/shop_register/:id", AuthenticateShop, update_shop_controller);

routes.delete("/shop_register/:id", AuthenticateShop, delete_shop_controller);

routes.post("/shop_login", login_shop_controller);

routes.get("/logoutShop", AuthenticateShop, logout_shop_controller);

routes.delete("/delete", delete_all);

//searching shops
routes.get("/searchShop/:pincode", search_shop_controller);

module.exports = routes;

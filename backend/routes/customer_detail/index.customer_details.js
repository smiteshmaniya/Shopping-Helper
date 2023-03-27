const express = require("express");
const routes = express.Router();
const AuthenticateCustomer = require("../../middleware/AuthenticateCustomer");
const nodemaier = require("nodemailer");
const {
  customer_register_controller,
  customer_login_controller,
  delete_all,
  customer_detail,
  customer_logout_controller,
  customer_register_verify,
  customer_forgote_password,
  customer_forgot_verify_password,
} = require("../../controllers/customer_controller");

routes.post("/customerRegister", customer_register_controller);

routes.get("/customerRegister/verify/:token", customer_register_verify);

routes.post("/customer/forgot", customer_forgote_password);
routes.post("/customer/forgot/verifypassword", customer_forgot_verify_password);

routes.post("/customerLogin", customer_login_controller);

// routes.get('/getdetail', AuthenticateCustomer, customer_detail)

routes.get("/logoutCustomer", AuthenticateCustomer, customer_logout_controller);

routes.delete("/deleteCust", delete_all);

module.exports = routes;

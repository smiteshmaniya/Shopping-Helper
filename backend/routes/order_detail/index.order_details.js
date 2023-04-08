const express = require('express')
const routes = express.Router();
const AuthenticateCustomer = require("../../middleware/AuthenticateCustomer")
const AuthenticateShop = require("../../middleware/AuthenticateShop");
const { order_controller, get_order_of_customer, get_order_of_shop, update_order_status } = require('../../controllers/order_constroller.js')

// routes.get('/getreq', order_controller);

routes.post('/makeOrder', AuthenticateCustomer, order_controller)

routes.get('/customerOrders/:id', AuthenticateCustomer, get_order_of_customer);

// orderHistory
routes.get('/orders', AuthenticateCustomer, get_order_of_customer);

routes.get('/shopOrders', AuthenticateShop, get_order_of_shop);

routes.put('/orderStatus/:orderId', update_order_status);

module.exports = routes;
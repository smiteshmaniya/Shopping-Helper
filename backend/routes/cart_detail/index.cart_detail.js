const express = require('express')
const routes = express.Router();
const AuthenticateCustomer = require("../../middleware/AuthenticateCustomer");
const { add_to_cart, get_cart, get_shop_cart, remove_from_cart, isInCart, remove_shop_cart } = require('../../controllers/cart_controller')

// AuthenticateCustomer
routes.post('/addtocart', AuthenticateCustomer, add_to_cart);
// AuthenticateCustomer
routes.get('/getcart', AuthenticateCustomer, get_cart);

// api to get one shop all product added in cart
routes.get('/getcart/:shop_id', AuthenticateCustomer, get_shop_cart);

// remove item from cart
routes.get('/remove/:shop_id/:product_id', AuthenticateCustomer, remove_from_cart)

// if item present in cart then return quentity of item that is added in cart
routes.get("/isincart/:shop_id/:product_id", AuthenticateCustomer, isInCart);

// remove shop cart is also called by place order function for removing that from cart
routes.get("/removeshopCart/:shop_id", AuthenticateCustomer, remove_shop_cart)
// Add get cart api here

module.exports = routes;

const order_schema = require('../model/order_schema')
const customer_schema = require('../model/customer_schema')
const cart_schema = require("../model/cart_schema")
const nodemailer = require('nodemailer');

// for seding secret code
function data(toEmail, toName, secureCode) {
    const htmldata = `
    <div>
        <p>Hello Mr/Mis ${toName}<p>
        <p>Your order is successfully place.  </p>
        <p>Your seceret code is ${secureCode}. Use this secret code while pick up your order.</p>
        <p>Thank you for shoping.</p>
        
    </div>
        `
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        // host: 'mail.btcbabil.com',
        // port: 587,
        // secure: false,
        auth: {
            user: 'quickpickwebapp@gmail.com',
            pass: 'quickpick@12345',
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    var mailOptions = {
        from: `${process.env.COMPANYNAME} <${toEmail}>`,
        to: toEmail,
        subject: 'Order Placed Successfully',
        text: `${process.env.COMPANYNAME}: Activation Account `,
        html: htmldata
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

// on success full order we can remove product from cart
const remove_shop_cart = async (custId, shopId) => {
    try {
        // const cust_id = req.id;
        // const shop_id = req.params.shop_id;
        const result = await cart_schema.deleteOne({ custId: custId, shopId: shopId });
    }
    catch (err) {
        console.log("Error while removing shop cart", err);
    }

}
module.exports = {
    order_controller: async (req, res) => {
        try {

            const custId = req.id;
            const {
                shopId,
                product_details,
                amount,
                pickup_time
                // payment_method
            } = req.body

            const secure_code = Math.floor((Math.random() * 10000) + 999);

            const order = new order_schema({
                custId,
                shopId,
                product_details,
                amount,
                pickup_time,
                // payment_method,
                secure_code
            });

            const saved_order = await order.save();

            const response = {
                status: true,
                statusCode: 200,
                message: 'Order is successully done.',
                orderData: saved_order
            }
            // remove whole shop cart when order is successfully one
            remove_shop_cart(custId, shopId);
            const customer = await customer_schema.findById({ _id: custId });
            data(customer.email, customer.name, secure_code)

            res.status(200).send(response)

        } catch (error) {
            res.status(500).send(error);
        }
    },

    get_order_of_customer: async (req, res) => {
        try {
            // here we take a customer id but not used it bcz this fun call for two id
            const orders = await order_schema.find({ custId: req.id })
                .populate('product_details.productId')
                .populate('shopId');
            const response = {
                status: true,
                statusCode: 200,
                message: 'All Orders of customer',
                userdata: orders
            }
            res.status(200).send(response)
        } catch (error) {
            res.status(500).send('error');
        }
    },

    get_order_of_shop: async (req, res) => {
        try {
            console.log('in..')
            const orders = await order_schema.find({ shopId: req.id })
                .populate('product_details.productId')
                .populate('shopId')
            console.log('oo...', orders)
            const response = {
                status: true,
                statusCode: 200,
                message: 'All Orders of shop',
                userdata: orders
            }
            res.status(200).send(response)
        } catch (error) {
            res.status(500).send('error');
        }
    },

    update_order_status: async (req, res) => {
        try {
            console.log(req.params.orderId)
            const order = await order_schema.findByIdAndUpdate({ _id: req.params.orderId }, {
                $set: {
                    order_status: 'pick up'
                }
            })
            res.status(200).send('success')
        } catch (error) {
            res.status(500).send(error);
        }
    }

}
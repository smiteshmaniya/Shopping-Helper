const mongoose = require('mongoose');

const order_schema = new mongoose.Schema({
    custId: {
        type: String,
        required: true
    },
    shopId: {
        type: String,
        ref: 'shop_detail',
        required: true,
    },
    product_details: [
        {
            productId: {
                type: String,
                ref: 'product_detail'
            },
            quantity: {
                type: Number,
                default: 1,
            },
        },
    ],
    amount: {
        type: Number,
        required: true,
        default: 0
    },
    secure_code: {
        type: Number,
        required: true
    },
    payment_method: {
        type: String,
        default: 'case on pickup'
    },
    order_status: {
        type: String,
        default: 'not pick up'
    },
    pickup_time: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const order_detail = mongoose.model('order_detail', order_schema);

module.exports = order_detail;
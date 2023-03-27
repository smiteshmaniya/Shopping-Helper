const cart_schema = require("../model/cart_schema");

module.exports = {
  add_to_cart: async (req, res) => {
    const custId = req.id; // this is taken from customer Authentication
    console.log(custId);
    const shopId = req.body.shopId;
    const productId = req.body.productId;
    const quantity = req.body.quantity;
    cart_schema
      .findOne({ custId, shopId })
      .then(async (cart) => {
        if (cart) {
          // console.log('cart', cart)

          const found = await cart_schema.findOne({
            $and: [{ custId, shopId, "productIds.productId": productId }],
          });
          if (found) {
            console.log("found", found);
            const setVal = await cart_schema.findOneAndUpdate(
              { custId, shopId, "productIds.productId": productId },
              {
                $set: {
                  "productIds.$.quantity": quantity,
                },
              }
            );

            res.status(200).json({
              message: "Product quantity modified successfully",
              data: setVal,
            });
          } else {
            console.log("pushed");
            const setVal = await cart_schema.findOneAndUpdate(
              { custId, shopId },
              {
                $push: {
                  productIds: {
                    productId,
                    quantity,
                  },
                },
              }
            );
            // console.log(setVal)
            res.status(200).json({
              message: "product added successfully.",
            });
          }

          // cart.productIds.map((val) => {
          //     console.log(val)
          //     if (val.productId == productId) {
          //         console.log('this is exist')
          //     }
          // })
        } else {
          const cart = new cart_schema({
            custId,
            shopId,
            productIds: [
              {
                productId,
                quantity,
              },
            ],
          });
          await cart.save();
          res.status(200).json({
            message: "cart added successfully",
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          status: true,
          statusCode: 500,
          message: "Server error",
        });
      });
  },
  remove_from_cart: async (req, res) => {
    try {
      console.log("REQ. COME");
      const cust_id = req.id;
      const shop_id = req.params.shop_id;
      const product_id = req.params.product_id;
      const result = await cart_schema.updateOne(
        { custId: cust_id, shopId: shop_id },
        {
          $pull: { productIds: { productId: product_id } },
        }
      );
      if (result) {
        const response = {
          status: true,
          statusCode: 204,
          message: "Produce removed successfully",
        };
        res.status(200).json(response);
      } else {
        res.status(500).json({ message: "Server crushed" });
      }
    } catch (err) {
      console.log("Error while removeing item from cart: ", err);
    }
  },

  isInCart: async (req, res) => {
    const shop_id = req.params.shop_id;
    const product_id = req.params.product_id;
    const cust_id = req.id;

    const result = await cart_schema.findOne(
      { custId: cust_id, shopId: shop_id, "productIds.productId": product_id },
      { "productIds.quantity": 1 }
    );

    const response = {
      status: true,
      statusCode: 200,
      inCart: result ? true : false, // if product not find then result is null
      quantity: result ? result.productIds[0].quantity : 0,
    };
    res.status(200).send(response);
  },

  get_cart: async (req, res) => {
    try {
      const cust_id = req.id;
      // console.log("get req for cart ", cust_id)
      const deleteEmpty = await cart_schema.deleteMany({
        productIds: { $size: 0 },
      }); // this will delete all shops card that will not contain any value
      // console.log(deleteEmpty)
      const result = await cart_schema
        .find({ custId: cust_id })
        .populate("shopId");
      // .populate('productIds.productId')
      const response = {
        status: true,
        statusCode: 200,
        message: "Data fetched",
        data: result,
      };
      res.status(200).json(response);
    } catch (err) {
      console.log("Error while get cart: ", err);
    }
  },

  remove_shop_cart: async (req, res) => {
    try {
      const cust_id = req.id;
      const shop_id = req.params.shop_id;
      const result = await cart_schema.deleteOne({
        custId: cust_id,
        shopId: shop_id,
      });
    } catch (err) {
      console.log("Error while removing shop cart", err);
    }
  },

  get_shop_cart: async (req, res) => {
    const cust_id = req.id;
    const shop_id = req.params.shop_id;
    // console.log("Custid: ", cust_id, "shop_id: ", shop_id)
    const result = await cart_schema
      .find({ $and: [{ custId: cust_id, shopId: shop_id }] })
      .populate("productIds.productId");
    console.log(result);
    const response = {
      status: true,
      statusCode: 200,
      message: "Data fetched of one shop",
      data: result,
    };
    res.status(200).send(response);
  },
};

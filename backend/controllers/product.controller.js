const product_detail = require("../model/product_schema");
const product_Schema = require("../model/product_schema");
// const shop_schema = require('../../model/shopDetails/shop_schema')
const Razorpay = require("razorpay");
module.exports = {
  get_product_and_shops: async (req, res) => {
    try {
      const productName = req.params.name;
      const products = await product_Schema
        .find({ name: { $regex: `(?i)${productName}` } })
        .populate("shop_id");
      if (products) {
        console.log(products);
        const response = {
          status: true,
          stautsCode: 200,
          userdata: products,
        };
        res.status(200).send(response);
      } else {
        const response = {
          status: false,
          stautsCode: 400,
          message: "Product not found.",
        };
        res.status(400).send(response);
      }
    } catch (e) {
      res.status(500).send("sever crashed.");
    }
  },
  add_product_controller: async (req, res) => {
    try {
      console.log("inside add product controller");
      // console.log(req.body)
      const { name, description, stock, price, tags, images } = req.body;
      if (
        !name ||
        !description ||
        !stock ||
        !price ||
        !tags ||
        isNaN(price) ||
        isNaN(stock)
      ) {
        // if given string is not a number then isNaN return true
        return res.status(400).json({
          status: false,
          statusCode: 400,
          message: "Please filled all filed properly",
        });
      }
      console.log(tags);
      const product = new product_Schema({
        shop_id: req.id,
        name,
        description,
        stock,
        price,
        tags,
        images,
      });

      const saved_product = await product.save();

      response = {
        status: true,
        statusCode: 200,
        message: "Product detail is added successfully",
        productDetail: saved_product,
      };
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: true,
        statusCode: 500,
        message: error,
      });
    }
  },
  all_shop_product_controller: async (req, res) => {
    try {
      // console.log('inside')
      const id = req.id;
      const product_details = await product_Schema.find({ shop_id: id });
      // .populate('shop_id')
      if (product_details) {
        // console.log(product_details)
        var response = {
          status: true,
          statusCode: 200,
          message: "Product founded...",
          products: product_details,
        };
        res.status(200).send(response);
      } else {
        var response = {
          status: false,
          statusCode: 400,
          message: "Product not founded...",
        };
        res.status(400).send(response);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("server crashed.");
    }
  },
  get_all_shop_product_controller: async (req, res) => {
    try {
      const shop_id = req.params.shop_id;
      const product_details = await product_Schema.find({ shop_id: shop_id });
      if (product_details) {
        var response = {
          status: true,
          statusCode: 200,
          message: "Product founded...",
          products: product_details,
        };
        res.status(200).send(response);
      } else {
        var response = {
          status: false,
          statusCode: 400,
          message: "Product not founded...",
        };
        res.status(400).send(response);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("server crashed.");
    }
  },
  get_all_shop_product_controller1: async (req, res) => {
    try {
      const shop_id = req.id;
      const product_details = await product_Schema.find({ shop_id: shop_id });
      // .populate('shop_id');
      // console.log(product_details)
      if (product_details) {
        // console.log(product_details)
        var response = {
          status: true,
          statusCode: 200,
          message: "Product founded...",
          products: product_details,
        };
        res.status(200).send(response);
      } else {
        var response = {
          status: false,
          statusCode: 400,
          message: "Product not founded...",
        };
        res.status(400).send(response);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("server crashed.");
    }
  },
  getBySearchController: async (req, res) => {
    try {
      const searchInput = req.params.search;
      const result = await product_detail.find({
        name: { $regex: `(?i)${searchInput}` },
      });
      var response = {
        status: true,
        statusCode: 200,
        message: "Product founded...",
        products: result,
      };
      res.status(200).send(response);
    } catch (error) {
      res.status(500).send("server error...");
    }
  },
  one_product_controller: async (req, res) => {
    try {
      const product_id = req.params.product_id;
      const product_detail = await product_Schema
        .findOne({ _id: product_id })
        .populate();
      if (product_detail) {
        const response = {
          status: true,
          stautsCode: 200,
          userdata: product_detail,
        };
        res.status(200).send(response);
      } else {
        const response = {
          status: false,
          stautsCode: 400,
          message: "user not exist.",
        };
        res.status(400).send(response);
      }
    } catch (error) {
      res.status(500).send("sever crashed.");
    }
  },
  update_product_controller: async (req, res) => {
    try {
      const product_id = req.params.product_id;

      const update = await product_Schema.findOneAndUpdate(
        { _id: product_id },
        req.body,
        {
          new: true,
        }
      );

      const response = {
        status: true,
        stautsCode: 200,
        userdata: update,
        message: "Product details updated successfully.",
      };
      res.status(200).send(response);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  delete_product_controller: async (req, res) => {
    try {
      const shop_id = req.params.shop_id;
      const product_id = req.params.product_id;

      await product_Schema.findOneAndDelete({
        $and: [{ shop_id, product_id }],
      });

      const response = {
        status: true,
        stautsCode: 200,
        message: "Shop details deleted successfully.",
      };
      res.status(200).send(response);

      // const delete_user = await product_Schema.findOneAndUpdate({ user_id }, {
      //     $pull: {
      //         all_products: { _id: product_id }
      //     }
      // });
      // if (delete_user) {
      //     const response = {
      //         status: true,
      //         stautsCode: 200,
      //         message: 'Shop details deleted successfully.'
      //     }
      //     res.status(200).send(response)
      // }
      // else {
      //     const response = {
      //         status: false,
      //         stautsCode: 400,
      //         message: 'user not exist.'
      //     }
      //     res.status(400).send(response)
      // }
    } catch (error) {
      res.status(500).send("server crashed.");
    }
  },
  get_all_products: async (req, res) => {
    try {
      const products = await product_Schema.find({});
      const response = {
        status: true,
        statusCode: 200,
        message: "All product details",
        products: products,
      };
      res.status(200).send(response);
    } catch (err) {
      console.log("Error while geting all produt: " + err);
    }
  },
  image_controller: async (req, res) => {
    try {
      const product = await product_Schema.findOne({
        _id: req.params.productId,
      });

      product.image.imgId = req.file.filename;
      product.image.url = `D:/frontend/public/upload/images/${req.file.filename}`;
      console.log("added..");
      await product.save();

      const response = {
        status: true,
        statusCode: 200,
        message: "successfully uploded",
        product: product,
      };

      res.status(200).send(response);
    } catch (error) {
      console.log(error);
      res.status(500).send("error");
    }
  },

  delete_all: async (req, res) => {
    try {
      await product_Schema.deleteMany({});
      res.send("successs");
    } catch (error) {
      res.send("error");
    }
  },
  razorPayController: async (req, res) => {
    console.log("body..", req.body);
    const result = await req.body.productDetails.map(async (val) => {
      try {
        let product = await product_Schema.findById(val.productId);
        console.log("product", product);
        if (product.stock - val.quantity > 0) {
          product.stock = product.stock - val.quantity;
          await product.save();
          return;
        }
      } catch (error) {
        res.status(500).send("inside loop error");
      }
    });

    Promise.all(result)
      .then(async (resultResponse) => {
        const shortid = require("shortid");
        const razorpay = new Razorpay({
          key_id: "rzp_test_7WR4xIlnq2U8Bk",
          key_secret: "gLZvkH4FyVixmdb9UIATPzKJ",
        });
        const payment_capture = 101;
        const amount = req.body.amount;
        const currency = "INR";
        const options = {
          amount: amount,
          currency,
          receipt: shortid.generate(),
          payment_capture,
        };
        try {
          const response = await razorpay.orders.create(options);
          console.log(response);
          res.status(200).send({
            id: response.id,
            currency: response.currency,
            amount: response.amount,
          });
        } catch (error) {
          console.log(error);
          res.status(400).send(error);
        }
      })
      .catch((error) => {
        res.status(500).send("error...");
      });
  },
};

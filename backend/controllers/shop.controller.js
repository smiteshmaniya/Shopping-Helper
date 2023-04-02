const shop_schema = require("../model/shop_schema");
const nodemailer = require("nodemailer");

// const product_schema = require('../../model/shopDetails/product_schema')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = nodemailer.createTransport({
  port: 465, // true for 465, false for other ports
  host: "smtp.gmail.com",
  auth: {
    user: "maniyasmiteshm@gmail.com",
    pass: process.env.GMAIL_PASSWORD,
  },
  secure: true,
});
const mailData = (toEmail, url) => {
  return {
    from: "maniyasmiteshm@gmail.com", // sender address
    to: toEmail, // list of receivers
    subject: "Sending Email using Node.js",
    text: "That was easy!",
    html:
      "<b>Hey there! </b>" +
      "<br>Please Click below to verify your account<br/>" +
      url,
  };
};

module.exports = {
  register_shop_controller: async (req, res) => {
    // console.log(req.body);
    console.log("REQ COME.....  ");
    try {
      const {
        shop_name,
        email,
        password,
        phone_number,
        owner_name,
        address,
        area,
        city,
        pincode,
        start_time,
        end_time,
      } = req.body;
      if (
        !shop_name ||
        !email ||
        !password ||
        !phone_number ||
        !owner_name ||
        !address ||
        !area ||
        !city ||
        !pincode ||
        !start_time ||
        !end_time
      ) {
        return res.status(400).json({
          status: true,
          statusCode: 400,
          message: "Please fill all the filled properly",
        });
      }

      const checkEmail = await shop_schema.findOne({ email });
      if (checkEmail)
        return res.status(409).json({
          status: true,
          statusCode: 409,
          message: "Email is already exist.",
        });

      const hash_password = await bcrypt.hash(password, 10);
      const user = new shop_schema({
        shop_name,
        email,
        password: hash_password,
        phone_number,
        owner_name,
        address,
        area,
        city,
        pincode,
        start_time,
        end_time,
      });

      const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY);
      await user.save();

      transporter.sendMail(
        mailData(
          email,
          `http://localhost:5000/api/shopRegister/verify/${token}`
        ),
        async function (err, info) {
          if (err) {
            console.log("Email not sent: ", err);
            res.status(500).json({
              message: "Server error in sending email.",
            });
          } else {
            const response = {
              status: true,
              statusCode: 200,
              message: "Verification link is sent to email",
            };
            res.status(200).json(response);
          }
        }
      );
    } catch (error) {
      console.log("error", error);
      res.status(500).json(error);
    }
  },
  shop_register_verify: async (req, res) => {
    try {
      const token = req.params.token;
      const emailid = jwt.verify(token, process.env.SECRET_KEY).email;
      const isUser = await shop_schema.findOne({ email: emailid });

      if (isUser) {
        isUser.isVaryfied = true;
        await isUser.save();
        res.redirect("http://localhost:3000/login?verified=true");
      } else {
        res.status(400).json({
          status: false,
          statusCode: 400,
          message: "invalid url",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        statusCode: 500,
        message: "Server error" + error,
      });
    }
  },
  shopkeeper_forgot_password: async (req, res) => {
    try {
      const isUser = await shop_schema.findOne({ email: req.body.email });
      if (isUser) {
        const token = jwt.sign(
          { id: isUser._id, email: isUser.email },
          process.env.SECRET_KEY
        );
        await transporter.sendMail(
          mailData(
            req.body.email,
            `http://localhost:3000/forgot/shopkeeper/${token}`
          )
        );
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: "Email sent.",
        });
      } else {
        res.status(201).json({
          status: false,
          statusCode: 400,
          message: "User not found",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        statusCode: 500,
        message: "Server error" + error,
      });
    }
  },
  shopkeeper_forgot_verify_password: async (req, res) => {
    try {
      console.log("forgot veryfy");
      const token = req.body.token;
      const tokenData = jwt.verify(token, process.env.SECRET_KEY);
      if (!tokenData) {
        return res.status(200).json({
          status: false,
          statusCode: 400,
          message: "user token not matched... please visit link again",
        });
      }
      const user = await shop_schema.findOne({ email: tokenData.email });
      const hash_password = await bcrypt.hash(req.body.password, 10);
      user.password = hash_password;
      await user.save();

      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Password successfully changed",
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        statusCode: 500,
        message: "Server error" + error,
      });
    }
  },
  login_shop_controller: async (req, res) => {
    try {
      const { email, password } = req.body;

      const shop = await shop_schema.findOne({ email });
      console.log(shop.isVaryfied);
      if (shop && !shop.isVaryfied) {
        return res.status(400).json({
          status: true,
          statusCode: 400,
          message: "Please Verify your account.",
        });
      }
      if (shop) {
        const hased_password = await bcrypt.compare(password, shop.password);

        if (hased_password) {
          const token = jwt.sign({ email: email }, process.env.SECRET_KEY);
          res.cookie("ct", "", {
            maxAge: 0,
            httpOnly: true,
          });
          res.cookie("st", token, {
            expires: new Date(Date.now() + 86400000),
            // httpOnly: true,
          });
          res.status(200).json({
            status: true,
            statusCode: 200,
            message: "user login successfull",
            token: token,
            userData: shop,
          });
        } else {
          res.status(400).json({
            status: true,
            statusCode: 400,
            message: "Invalid credentials",
          });
        }
      } else {
        res.status(400).json({
          status: true,
          statusCode: 400,
          message: "User is not exits",
        });
      }
    } catch (error) {
      console.log("error: " + error);
      res.status(500).json({
        message: "Server error",
      });
    }
  },
  logout_shop_controller: async (req, res) => {
    try {
      res.cookie("st", "", {
        maxAge: 0,
        httpOnly: true,
      });

      res.cookie("ct", "", {
        maxAge: 0,
        httpOnly: true,
      });
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Logout successful",
      });
    } catch (err) {
      console.log("Error while logout shopKeeper: ", err);
      res.status(500).json({
        status: true,
        statusCode: 500,
        message: "Server Error",
      });
    }
  },

  all_shops_controller: async (req, res) => {
    try {
      console.log("in......");
      const registerDetails = await shop_schema.find({});
      if (registerDetails) {
        var response = {
          status: true,
          statusCode: 200,
          message: "All shop details",
          userdata: registerDetails,
        };
        res.status(200).send(response);
      } else {
        var response = {
          status: false,
          statusCode: 400,
          message: "Userdata not founded...",
        };
        res.status(400).send(response);
      }
    } catch (error) {
      res.status(500).send("server crashed.");
    }
  },

  one_shop_controller: async (req, res) => {
    try {
      const _id = req.id; // this id is added while authenticating
      // console.log(_id)
      const user = await shop_schema.findOne({ _id });
      if (user) {
        var response = {
          status: true,
          stautsCode: 200,
          message: "User exist",
          userdata: user,
        };
        res.status(200).send(response);
      } else {
        var response = {
          status: false,
          statusCode: 400,
          message: "Userdata not exist",
        };
        res.status(400).send(response);
      }
    } catch (error) {
      res.status(500).send("sever crashed.");
    }
  },

  update_shop_controller: async (req, res) => {
    try {
      const _id = req.id;
      const user = await shop_schema.findByIdAndUpdate(_id, req.body, {
        new: true,
      });
      if (user) {
        var response = {
          status: true,
          statusCode: 200,
          message: "Updated successfully.",
          userdata: user,
        };
        res.status(200).send(response);
      } else {
        var response = {
          status: false,
          statusCode: 400,
          message: "Userdata not updated",
        };
        res.status(400).send(response);
      }
    } catch (error) {
      res.status(500).send("server crashed.");
    }
  },

  delete_shop_controller: async (req, res) => {
    try {
      const _id = req.params.id;
      const delete_user = await shop_schema.findByIdAndDelete({ _id });
      if (delete_user) {
        var response = {
          status: true,
          statusCode: 200,
          message: "User deleted successfully.",
          userdata: delete_user,
        };
        res.status(200).send(response);
      } else {
        var response = {
          status: false,
          statusCode: 400,
          message: "Userdata not deleted.",
        };
        res.status(400).send(response);
      }
    } catch (error) {
      res.status(500).send("server crashed.");
    }
  },

  search_shop_controller: async (req, res) => {
    try {
      const num = parseInt(req.params.pincode);
      if (num) {
        const shops = await shop_schema.find({ pincode: num });
        if (shops) {
          var response = {
            status: true,
            statusCode: 200,
            message: "All shop details",
            userdata: shops,
          };
          res.status(200).send(response);
        } else {
          var response = {
            status: false,
            statusCode: 400,
            message: "Shops not founded...",
          };
          res.status(400).send(response);
        }
      } else {
        var response = {
          status: false,
          statusCode: 400,
          message: "Please Enter The Number",
        };
        res.status(400).send(response);
      }
    } catch (error) {
      res.status(500).send("server crashed.");
      console.log(error);
    }
  },
  delete_all: async (req, res) => {
    try {
      const s = await shop_schema.deleteMany({});
      console.log("success");
      res.send("success");
    } catch (error) {
      console.log("error");
    }
  },
};

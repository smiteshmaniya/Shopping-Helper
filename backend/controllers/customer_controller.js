const customer_schema = require("../model/customer_schema");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

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
  customer_register_controller: async (req, res) => {
    const {
      email,
      phone_number,
      password,
      name,
      address,
      area,
      city,
      pincode,
    } = req.body;

    try {
      if (
        !email ||
        !phone_number ||
        !password ||
        !name ||
        !address ||
        !area ||
        !city ||
        !pincode
      ) {
        return res.json({
          status: true,
          statusCode: 400,
          message: "Please filled all filed properly",
        });
      }

      const user = await customer_schema.findOne({
        $or: [{ email }, { phone_number }],
      });

      if (user) {
        return res.status(409).json({
          status: true,
          statusCode: 409,
          message: "Email already exist",
        });
      }

      const hash_password = await bcrypt.hash(password, 10);

      const userdata = new customer_schema({
        email,
        phone_number,
        password: hash_password,
        name,
        address,
        area,
        city,
        pincode,
      });

      const token = jwt.sign({ email: userdata.email }, process.env.SECRET_KEY);
      await userdata.save();

      transporter.sendMail(
        mailData(
          email,
          `http://localhost:5000/api/customerRegister/verify/${token}`
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
              message: "verification link sent to email.",
            };
            res.status(200).json(response);
          }
        }
      );

      // console.log("url is ", response.url);
    } catch (error) {
      console.log("Error while register customer: ", error);
      res.status(500).json({
        message: "Server error in registering user.",
      });
    }
  },

  customer_register_verify: async (req, res) => {
    try {
      const token = req.params.token;
      const emailid = jwt.verify(token, process.env.SECRET_KEY).email;
      const isUser = await customer_schema.findOne({ email: emailid });

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

  customer_forgote_password: async (req, res) => {
    try {
      const isUser = await customer_schema.findOne({ email: req.body.email });
      if (isUser) {
        const token = jwt.sign(
          { id: isUser._id, email: isUser.email },
          process.env.SECRET_KEY
        );
        await transporter.sendMail(
          mailData(
            req.body.email,
            `http://localhost:3000/forgot/customer/${token}`
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
  customer_forgot_verify_password: async (req, res) => {
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
      const user = await customer_schema.findOne({ email: tokenData.email });
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

  customer_login_controller: async (req, res) => {
    const { email, password } = req.body;

    const customer = await customer_schema.findOne({ email });
    if (customer && !customer.isVaryfied) {
      return res.status(400).json({
        status: true,
        statusCode: 400,
        message: "Please Verify your account.",
      });
    }

    if (customer && customer.isVaryfied) {
      const hased_password = await bcrypt.compare(password, customer.password);
      if (hased_password) {
        // console.log("--------------------")
        const token = jwt.sign(
          { email: customer.email },
          process.env.SECRET_KEY
        );
        res.cookie("st", "", {
          maxAge: 0,
          httpOnly: true,
        });
        res.cookie("ct", token, {
          expires: new Date(Date.now() + 25892000000),
          httpOnly: true,
        });
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: "user login successfull",
          token: token,
          userData: customer,
        });
      } else {
        res.json({
          status: true,
          statusCode: 400,
          message: "Email and Password are not matched",
        });
      }
    } else {
      res.status(400).json({
        status: true,
        statusCode: 400,
        message: "User is not exits",
      });
    }
  },

  customer_logout_controller: async (req, res) => {
    try {
      res.cookie("ct", "", {
        maxAge: 0,
        httpOnly: true,
      });
      res.status(200).send({
        status: true,
        statusCode: 200,
        message: "Logout successful",
      });
    } catch (err) {
      console.log("Error while logout customer: ", err);
      res.status(500).send({
        status: true,
        statusCode: 500,
        message: "Server error",
      });
    }
  },

  customer_update_controller: async (req, res) => {
    try {
      const update = await customer_schema.findOneAndUpdate(
        { _id: req.params.customerId },
        req.body,
        {
          new: true,
        }
      );

      if (update) {
        res.status(200).json({
          message: "Customer detail updated successfully",
        });
      } else {
        res.status(400).json({
          message: "Customer detail not updated",
        });
      }
    } catch (error) {
      res.status(500).send("error");
    }
  },

  delete_all: async (req, res) => {
    await customer_schema.deleteMany({});
    res.send("success");
  },
};

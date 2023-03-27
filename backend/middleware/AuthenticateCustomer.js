const customer_detail = require("../model/customer_schema");
const jwt = require("jsonwebtoken");

const AuthenticateCustomer = async (req, res, next) => {
  try {
    const token = req.cookies.ct;
    let response = {
      status: false,
      statusCode: 400,
    };
    if (!token) {
      response = {
        ...response,
        message: "You must need to login for access this page",
      };
      return res.status(400).json(response);
    }

    const email = jwt.verify(token, process.env.SECRET_KEY).email;
    const result = await customer_detail.findOne({ email: email });
    if (!result) {
      response = {
        ...response,
        message: "User not Found.",
      };
      return res.status(400).json(response);
    }
    // console.log(result);
    else {
      req.id = result._id;
      next();
    }
  } catch (err) {
    console.log("Error while autheticating customer: " + err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = AuthenticateCustomer;

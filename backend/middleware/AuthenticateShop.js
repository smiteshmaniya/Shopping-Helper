const shop_detail = require("../model/shop_schema");
const jwt = require("jsonwebtoken");

const AuthenticateShop = async (req, res, next) => {
  console.log("Authenticating shop");
  try {
    const token = req.cookies.st;
    const response = {
      status: true,
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
    const result = await shop_detail.findOne({ email: email });
    if (!result) {
      response = {
        ...response,
        message: "User not Found.",
      };
      res.status(400).json(response);
    }
    // console.log(result);
    req.id = result._id;
    next();
  } catch (err) {
    console.log("Error while authenticate shop : " + err);
  }
};
module.exports = AuthenticateShop;

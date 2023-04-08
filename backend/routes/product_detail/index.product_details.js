const express = require("express");
const routes = express.Router();
const AuthenticateShop = require("../../middleware/AuthenticateShop");
const AuthenticateCustomer = require("../../middleware/AuthenticateCustomer");
const {
  add_product_controller,
  get_all_shop_product_controller1,
  get_all_shop_product_controller,
  all_shop_product_controller,
  one_product_controller,
  update_product_controller,
  delete_product_controller,
  image_controller,
  get_all_products,
  delete_all,
  deleteProductImage,
  get_product_and_shops,
} = require("../../controllers/product.controller");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "D:/quick-pick final/QuickPick/frontend/public/upload/images",
  filename: (req, file, cb) => {
    // console.log('file', file)
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 500 * 10 },
});

routes.use("/productImage", express.static("upload/images"));

// This will add products
routes.post("/productDetail", AuthenticateShop, add_product_controller);

routes.post(
  "/upload/:productId",
  upload.single("productImage"),
  image_controller
);

routes.get(
  "/productDetail/shop",
  AuthenticateShop,
  all_shop_product_controller
);

routes.get("/getShopProducts/:shop_id", get_all_shop_product_controller);
routes.get(
  "/getShopProducts",
  AuthenticateShop,
  get_all_shop_product_controller1
);

routes.get("/getproducts", get_all_products); // HERE add authenticate middleware
routes.get("/searchProduct/:name", get_product_and_shops);
routes.get("/productDetail/:product_id", one_product_controller);

routes.put(
  "/productDetail/:product_id",
  AuthenticateShop,
  update_product_controller
);

routes.delete(
  "/productDetail/:shop_id/:product_id",
  AuthenticateShop,
  delete_product_controller
);

routes.delete("/deleteProduct", delete_all);

//routes.put("/productDetail/deleteImage", deleteProductImage);

module.exports = routes;

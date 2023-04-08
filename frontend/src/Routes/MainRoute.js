import React, { createContext, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../Components/Login";
import Navbar from "../Components/partials/Navbar";
import Footer from "../Components/partials/Footer";
import SignUp from "../Components/SignUp";
import Home from "../Components/Home";
import Logout from "../Components/Logout";
import { Box, Container } from "@chakra-ui/react";
import ForgotPassword from "../Components/ForgotPassword";
import ResetPassword from "../Components/ResetPassword";
import Errorpage from "../Components/partials/Errorpage";
import AddProduct from "../Components/Shop/AddProduct";
import ShopProducts from "../Components/Shop/ShopProducts";
import EditShopProduct from "../Components/Shop/EditShopProduct";
import ShopKeeperProfile from "../Components/Shop/ShopKeeperProfile";

import DisplayShops from "../Components/Customer/DisplayShops";
import DisplayProducts from "../Components/Customer/DisplayProducts";
import ShowProduct2 from "../Components/Customer/ShowProduct2";

import Cart_With_shop from "../Components/Customer/Cart_With_shop";
import DisplayCartProduct from "../Components/Customer/DisplayCartProduct";
import CustomerProfile from "../Components/Customer/CustomerProfile";

import Order_History from "../Components/Customer/Order_History";
import ShopOrder from "../Components/Shop/ShopOrder";

export const userContext = createContext([]);

export const MainRoute = () => {
  const [isuser, setisuser] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  return (
    <>
      <userContext.Provider
        value={{ isuser, setisuser, profileImage, setProfileImage }}
      >
        <Navbar />
        <Box minH={"50vh"} minHeight={"70vh"}>
          <Routes>
            <Route exact path="/" element={<Home />}></Route>

            <Route exact path="/login" element={<Login />}></Route>
            <Route exact path="/signup" element={<SignUp />}></Route>
            <Route exact path="/logout" element={<Logout />}></Route>
            <Route
              exact
              path="/forgot/:who/:token"
              element={<ResetPassword />}
            ></Route>
            <Route
              exact
              path="/forgot/:who"
              element={<ForgotPassword />}
            ></Route>

            <Route exact path="/addproduct" element={<AddProduct />}></Route>
            <Route
              exact
              path="/shopproducts"
              element={<ShopProducts />}
            ></Route>
            <Route
              exact
              path="/editproduct/:proudctId"
              element={<EditShopProduct />}
            ></Route>

            <Route
              exact
              path="/shopprofile"
              element={<ShopKeeperProfile />}
            ></Route>

            {/* customer routes */}
            <Route
              exact
              path="/customerprofile"
              element={<CustomerProfile />}
            ></Route>
            <Route
              exact
              path="/displayshops"
              element={<DisplayShops />}
            ></Route>
            <Route
              exact
              path="/shopproducts/:shop_id"
              element={<DisplayProducts />}
            ></Route>
            <Route
              exact
              path="/product/:shopId/:productId"
              element={<ShowProduct2 />}
            ></Route>

            {/* cart */}
            <Route exact path="/cart" element={<Cart_With_shop />}></Route>
            <Route
              exact
              path="/cartproducts/:shop_id"
              element={<DisplayCartProduct />}
            ></Route>

            {/* order routes */}
            <Route exact path="/orders" element={<Order_History />}>
              {" "}
            </Route>
            <Route exact path="/shoporders" element={<ShopOrder />}></Route>

            <Route path="*" element={<Errorpage />}></Route>
          </Routes>
        </Box>
        <Footer />
      </userContext.Provider>
    </>
  );
};

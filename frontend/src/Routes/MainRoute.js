import React, { createContext, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../Components/Login";
import Navbar from "../Components/partials/Navbar";
import Footer from "../Components/partials/Footer";
import SignUp from "../Components/SignUp";
import Home from "../Components/Home";
import Logout from "../Components/Logout";
import { Box } from "@chakra-ui/react";
import ForgotPassword from "../Components/ForgotPassword";
import ResetPassword from "../Components/ResetPassword";
import Errorpage from "../Components/partials/Errorpage";
import AddProduct from "../Components/Shop/AddProduct";
import ShopProducts from "../Components/Shop/ShopProducts";
import EditShopProduct from "../Components/Shop/EditShopProduct";

export const userContext = createContext([]);

export const MainRoute = () => {
  const [isuser, setisuser] = useState("");
  return (
    <>
      <userContext.Provider value={{ isuser, setisuser }}>
        <Navbar />
        <Box minH={"50vh"}>
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

            <Route path="*" element={<Errorpage />}></Route>
          </Routes>
        </Box>
        <Footer />
      </userContext.Provider>
    </>
  );
};

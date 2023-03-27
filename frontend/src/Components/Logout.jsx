import React, { useEffect } from "react";
import {
  Box,
  Text,
  Center,
  Flex,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { API } from "./API/api_url";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function Logout() {
  const navigate = useNavigate();
  const toast = useToast();
  // // This will give a message in type of alert that can be remove in 3s
  const ShowToast = (details) => {
    toast({
      ...details,
      duration: 3000,
      isClosable: true,
      position: "bottom-right",
      variant:
        localStorage.getItem("chakra-ui-color-mode") === "light"
          ? "subtle"
          : "solid",
    });
  };

  const logoutFun = async () => {
    try {
      const whoisLoggedIn = localStorage.getItem("whoIsLoggedIn");
      const url = `${API}/api/logout${
        whoisLoggedIn === "customer" ? "Customer" : "Shop"
      }`;
      const response = await axios.get(url);
      if (response.data.statusCode === 200) {
        ShowToast({
          title: "Success!",
          description: response.data.message,
          status: "success",
        });
        localStorage.removeItem("whoIsLoggedIn");
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        navigate("/");
        window.location.reload();
      }
    } catch (err) {
      ShowToast({
        title: "Error!",
        description: err.response.data.message,
        status: "error",
      });
      navigate("/");
    }
  };
  useEffect(() => {
    logoutFun();
    console.log("logout....");
  }, []);
  return (
    <>
      <Flex mt={8} alignContent={"center"} justifyContent={"center"}>
        <Center>
          <Text
            as="h2"
            fontWeight={600}
            color={useColorModeValue("gray.700", "white")}
          >
            Logging out please wait...
          </Text>
        </Center>
      </Flex>
    </>
  );
}

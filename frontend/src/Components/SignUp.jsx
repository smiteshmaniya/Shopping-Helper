import React from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  RadioGroup,
  Radio,
  CheckboxGroup,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { API } from "./API/api_url";
import showToast from "./partials/showToast";
import { useNavigate } from "react-router-dom";
const axios = require("axios");

// Sign up form for shop
const ShopRegister = () => {
  const toast = useToast();
  const navigate = useNavigate();

  // // put spinner and toast
  // const [status, setStatus] = ({
  //     type: '',
  //     title: '',
  //     massage: '',
  // })
  const initalData = {
    shop_name: "",
    email: "",
    password: "",
    phone_number: "",
    owner_name: "",
    address: "",
    area: "",
    city: "",
    pincode: "",
    start_time: "",
    end_time: "",
  };
  const [shopDetail, setShopDetail] = useState(initalData);
  const [isBtnLoading, setIsBtnLoading] = useState(false);

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
  const inputHandler = (e) => {
    const { name, value } = e.target;
    // console.log(name, value)
    setShopDetail((preVal) => {
      return {
        ...preVal,
        [name]: value,
      };
    });
  };

  const onsubmit = async () => {
    // console.log("Going....", shopDetail)
    try {
      let strongPassword = new RegExp(
        "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
      );

      if (!strongPassword.test(shopDetail.password)) {
        return showToast(toast, {
          title: "Signup Unsuccessfull",
          description: "Please Enter Strong Password!",
          status: "error",
        });
      }
      let re = /\S+@\S+\.\S+/;
      let isEmail = new RegExp(re);

      if (!isEmail.test(shopDetail.email)) {
        return showToast(toast, {
          title: "Signup unsuccessfull",
          description: "Please Enter Valid Email!",
          status: "error",
        });
      }
      setIsBtnLoading(true);
      const res = await axios.post(`${API}/api/shop_register`, shopDetail);
      console.log("res is", res.data);
      setIsBtnLoading(false);
      if (res.data.statusCode === 200) {
        setShopDetail(initalData);
        ShowToast({
          title: "Success!",
          description: res.data.message,
          status: "success",
        });
        navigate("/login");
      }
    } catch (err) {
      setIsBtnLoading(false);
      ShowToast({
        title: "Error!",
        description: err.response.data.message,
        status: "error",
      });
    }
  };

  return (
    <>
      <FormControl id="shop_name" isRequired>
        <FormLabel>Shop Name</FormLabel>
        <Input
          type="text"
          name="shop_name"
          onChange={inputHandler}
          value={shopDetail.shop_name}
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Email address</FormLabel>
        <Input
          type="email"
          name="email"
          onChange={inputHandler}
          value={shopDetail.email}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>password</FormLabel>
        <InputGroup>
          <Input
            type="password"
            name="password"
            onChange={inputHandler}
            value={shopDetail.password}
          />
          <InputRightElement h={"full"}>
            {/* <Button
                            variant={'ghost'}
                        // onClick={() =>
                        //     setShowPassword((showPassword) => !showPassword)
                        // }
                        >
                             {showPassword ? <ViewIcon /> : <ViewOffIcon />} 
                        </Button> */}
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="owner_name" isRequired>
        <FormLabel>Owner Name</FormLabel>
        <Input
          type="text"
          name="owner_name"
          onChange={inputHandler}
          value={shopDetail.owner_name}
        />
      </FormControl>
      <FormControl id="phone_number" isRequired>
        <FormLabel>Phone Number</FormLabel>
        <Input
          type="text"
          name="phone_number"
          onChange={inputHandler}
          value={shopDetail.phone_number}
        />
      </FormControl>

      <FormControl id="address" isRequired>
        <FormLabel>Address</FormLabel>
        <Input
          type="text"
          name="address"
          onChange={inputHandler}
          value={shopDetail.address}
        />
      </FormControl>

      <Stack spacing={5} direction="row">
        <FormControl id="area" isRequired>
          <FormLabel>area</FormLabel>
          <Input
            type="text"
            name="area"
            onChange={inputHandler}
            value={shopDetail.area}
          />
        </FormControl>
        <FormControl id="city" isRequired>
          <FormLabel>city</FormLabel>
          <Input
            type="text"
            name="city"
            onChange={inputHandler}
            value={shopDetail.city}
          />
        </FormControl>
        <FormControl id="pincode" isRequired>
          <FormLabel>Pincode</FormLabel>
          <Input
            type="text"
            name="pincode"
            onChange={inputHandler}
            value={shopDetail.pincode}
          />
        </FormControl>
      </Stack>

      <Stack spacing={5} direction="row">
        <FormControl id="start_time" isRequired>
          <FormLabel>Shop Starting Time</FormLabel>
          <Input
            type="text"
            name="start_time"
            onChange={inputHandler}
            value={shopDetail.start_time}
          />
        </FormControl>
        <FormControl id="end_time" isRequired>
          <FormLabel>Shop Ending Time</FormLabel>
          <Input
            type="text"
            name="end_time"
            onChange={inputHandler}
            value={shopDetail.end_time}
          />
        </FormControl>
      </Stack>

      <Stack spacing={10} pt={2}>
        <Button
          loadingText="Submitting"
          size="lg"
          bg={"blue.400"}
          color={"white"}
          onClick={onsubmit}
          _hover={{
            bg: "blue.500",
          }}
          isLoading={isBtnLoading ? true : false}
        >
          Sign up
        </Button>
      </Stack>
    </>
  );
};

// Sign up form for customer
const CustomerRegiter = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const initalValue = {
    email: "",
    phone_number: "",
    password: "",
    name: "",
    address: "",
    area: "",
    city: "",
    pincode: "",
  };
  const [custDetail, setCustDetail] = useState(initalValue);
  const [isBtnLoading, setIsBtnLoading] = useState(false);

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

  const handleInput = (e) => {
    const { name, value } = e.target;
    // console.log(name, value)

    setCustDetail((preVal) => {
      return {
        ...preVal,
        [name]: value,
      };
    });
  };

  const onSubmit = async (e) => {
    try {
      let strongPassword = new RegExp(
        "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
      );

      if (!strongPassword.test(custDetail.password)) {
        return showToast(toast, {
          title: "Signup Unsuccessfull",
          description: "Please Enter Strong Password!",
          status: "error",
        });
      }
      let re = /\S+@\S+\.\S+/;
      let isEmail = new RegExp(re);

      if (!isEmail.test(custDetail.email)) {
        return showToast(toast, {
          title: "Signup unsuccessfull",
          description: "Please Enter Valid Email!",
          status: "error",
        });
      }

      setIsBtnLoading(true);
      e.preventDefault();
      const response = await axios.post(
        `${API}/api/customerRegister`,
        custDetail
      ); // remove password from response
      setIsBtnLoading(false);

      if (response.data.statusCode === 200) {
        setCustDetail(initalValue);
        ShowToast({
          title: "Verify Email!",
          description: response.data.message,
          status: "info",
        });
      } else {
        ShowToast({
          title: "Failed!",
          description: response.data.message,
          status: "error",
        });
      }
      navigate("/login");
    } catch (err) {
      setIsBtnLoading(false);
      ShowToast({
        title: "Error!",
        description: err.response.data.message,
        status: "error",
      });
    }
  };

  return (
    <>
      <Stack spacing={4}>
        <FormControl id="custName" isRequired>
          <FormLabel>Customer Name</FormLabel>
          <Input
            type="text"
            name="name"
            onChange={handleInput}
            value={custDetail.name}
          />
        </FormControl>
        <FormControl id="cusEmail" isRequired>
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            name="email"
            onChange={handleInput}
            value={custDetail.email}
          />
        </FormControl>

        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type="password"
              name="password"
              onChange={handleInput}
              value={custDetail.password}
            />
          </InputGroup>
        </FormControl>
        <FormControl id="phoneNo" isRequired>
          <FormLabel>Phone Number</FormLabel>
          <Input
            type="text"
            name="phone_number"
            onChange={handleInput}
            value={custDetail.phone_number}
          />
        </FormControl>

        <FormControl id="address" isRequired>
          <FormLabel>Address</FormLabel>
          <Input
            type="text"
            name="address"
            onChange={handleInput}
            value={custDetail.address}
          />
        </FormControl>

        <Stack spacing={5} direction="row">
          <FormControl id="area" isRequired>
            <FormLabel>area</FormLabel>
            <Input
              type="text"
              name="area"
              onChange={handleInput}
              value={custDetail.area}
            />
          </FormControl>
          <FormControl id="city" isRequired>
            <FormLabel>city</FormLabel>
            <Input
              type="text"
              name="city"
              onChange={handleInput}
              value={custDetail.city}
            />
          </FormControl>
          <FormControl id="Pincode" isRequired>
            <FormLabel>Pincode</FormLabel>
            <Input
              type="text"
              name="pincode"
              onChange={handleInput}
              value={custDetail.pincode}
            />
          </FormControl>
        </Stack>

        <Stack spacing={10} pt={2}>
          <Button
            loadingText="Submitting"
            size="lg"
            bg={"blue.400"}
            color={"white"}
            onClick={onSubmit}
            _hover={{
              bg: "blue.500",
            }}
            isLoading={isBtnLoading ? true : false}
          >
            Sign up
          </Button>
        </Stack>
      </Stack>
    </>
  );
};

// Signup form radio button
export default function SignUp() {
  const [isShopKeeper, setisShopkepeer] = useState(1);

  //   useEffect(() => {
  //     console.log("inside ...");
  //   }, [isShopKeeper]);
  // checking the detail of cusomer and shopkeeper
  const user = (e) => {
    e.preventDefault();

    console.log("this is ", e.target.value, "vla", isShopKeeper);
    if (e.target.value == "shopkeeper") setisShopkepeer(0);
    else setisShopkepeer(1);
  };
  console.log("sign up ...");
  return (
    <>
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"} textAlign={"center"}>
              Sign up for {isShopKeeper ? "Customer" : "Shopkeeper"}
            </Heading>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <RadioGroup defaultValue="customer" my={2} mx={"auto"}>
              <Stack spacing={5} direction="row" onChange={user}>
                <Radio colorScheme="green" value="customer" checked>
                  Customer
                </Radio>
                <Radio colorScheme="green" value="shopkeeper">
                  Shopkeeper
                </Radio>
              </Stack>
            </RadioGroup>
            <Stack spacing={4} my={3}>
              {isShopKeeper == 1 ? <CustomerRegiter /> : <ShopRegister />}
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </>
  );
}

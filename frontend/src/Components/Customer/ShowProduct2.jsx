import {
  Box,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  useColorModeValue,
  useToast,
  Center,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API } from "../API/api_url";
import axios from "axios";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import ImageSlider from "./ImageSlider";
import { SlideData } from "./SlideData";

export default function ShowProduct2() {
  const { shopId, productId } = useParams();
  const [productDetail, setproductDetail] = useState("");
  const [count, setCount] = useState(0);
  const [shopDetail, setShopDetail] = useState({});
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
  const handleCount = (e) => {
    const value = e.target.value;
    // console.log(value)
    if (value === "-" && count >= 0) {
      setCount(count - 1);
    }
    if (value === "+") {
      setCount(count + 1);
    }
  };
  const addtocart = async (e) => {
    try {
      const response = await axios.post(`${API}/api/addtocart`, {
        shopId: shopId,
        productId: productId,
        quantity: count,
      });
      ShowToast({
        title: "Success!",
        description: response.data.message,
        status: "success",
      });
    } catch (err) {
      ShowToast({
        title: "Error!",
        description: err.response.data.message,
        status: "error",
      });
    }
  };

  useEffect(() => {
    getProduct();
    isInCart();
  }, [productId]);

  const getProduct = async () => {
    const product = await axios.get(`${API}/api/productDetail/${productId}`);
    setproductDetail(product.data.userdata);
    console.log(product.data.userdata.images.length);

    const shopDetail = await axios.get(`${API}/api/getAddress/${shopId}`);
    setShopDetail(shopDetail.data.userData);
    console.log(shopDetail.data.userData);
  };
  const isInCart = async () => {
    const result = await axios.get(
      `${API}/api/isincart/${shopId}/${productId}`
    );
    if (result.data.statusCode === 200) {
      if (result.data.quantity) setCount(result.data.quantity);
    } else {
      console.error("Error while checking product present in cart or not");
    }
  };

  return (
    <Container maxW={"7xl"} mt={8}>
      {/* page heading */}
      <Center>
        <Heading
          lineHeight={1.1}
          fontWeight={600}
          fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
          mb={8}
          textTransform={"capitalize"}
        >
          {productDetail.name}
        </Heading>
      </Center>
      <Flex flexDirection={"column"}>
        {/* image slider */}
        <Flex>
          <Box>
            <Box
              display={"block"}
              marginLeft={"auto"}
              marginRight={"auto"}
              h="40%"
            >
              <ImageSlider
                slides={productDetail.images ? productDetail.images : SlideData}
              />
            </Box>
          </Box>
          {/* <Image
            rounded={"md"}
            alt={"product image"}
            src={
              productDetail.images ? `${productDetail.images[0].imageUrl}` : ""
            }
            // fit={'cover'}
            // align={'center'}
            w={"100%"}
            h={"auto"}
          /> */}
        </Flex>

        {/* product discription */}
        <Flex flexDirection={"row"} justifyContent={"space-between"}>
          <Box>
            <Stack spacing={{ base: 6, md: 10 }}>
              <Box as={"header"}>
                <Heading
                  lineHeight={1.1}
                  fontWeight={600}
                  fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
                  textTransform={"capitalize"}
                >
                  {productDetail.name}
                </Heading>
                <Text
                  color={useColorModeValue("gray.900", "gray.400")}
                  fontWeight={400}
                  fontSize={"2xl"}
                  my={3}
                >
                  Price: ₹ {productDetail.price}
                </Text>
                {/* <Text
                  color={useColorModeValue("gray.900", "gray.400")}
                  fontWeight={300}
                  fontSize={"2xl"}
                >
                  Stock: {productDetail.stock}
                </Text> */}
              </Box>

              <Stack
                direction={"column"}
                divider={
                  <StackDivider
                    borderColor={useColorModeValue("gray.200", "gray.600")}
                  />
                }
              >
                <VStack
                  //spacing={{ base: 4, sm: 6 }}
                  alignItems={"left"}
                  justifyContent={"center"}
                >
                  <Heading
                    fontWeight={600}
                    fontSize={30}
                    textTransform={"capitalize"}
                    justifyContent={"left"}
                  >
                    Description:
                  </Heading>
                  <Text
                    color={useColorModeValue("gray.500", "gray.400")}
                    fontSize={20}
                    fontWeight={"300"}
                    justifyContent="center"
                  >
                    {productDetail.description}
                  </Text>
                  {/* <Text fontSize={'lg'}>
                {productDetail.description}
              </Text> */}
                </VStack>
              </Stack>
              <Box>
                <Heading
                  fontWeight={600}
                  fontSize={30}
                  textTransform={"capitalize"}
                  justifyContent={"left"}
                >
                  Address:
                </Heading>
                <Text
                  color={useColorModeValue("gray.500", "gray.400")}
                  fontSize={18}
                  fontWeight={"200"}
                  justifyContent="center"
                  textTransform={"capitalize"}
                >
                  {`${shopDetail.address} ${shopDetail.city} ${shopDetail.pincode}.`}{" "}
                  <br />
                  Timing: Starts from {shopDetail.start_time} - ends at{" "}
                  {shopDetail.end_time}
                </Text>
              </Box>

              {/* 
          <Flex direction={"column"} m={"auto"}>
            <Text fontWeight={600} size="md" my={2}>
              <Flex direction={"row"} justifyContent={"space-evenly"}>
                <Button
                  bg={useColorModeValue("gray.900", "gray.50")}
                  color={useColorModeValue("white", "gray.900")}
                  size="md"
                  value="-"
                  id="moinsminus"
                  onClick={handleCount}
                  isDisabled={count ? false : true}
                >
                  <MinusIcon />
                </Button>
                {count}{" "}
                <Button
                  bg={useColorModeValue("gray.900", "gray.50")}
                  color={useColorModeValue("white", "gray.900")}
                  size="md"
                  value="+"
                  id="moinsplus"
                  onClick={handleCount}
                >
                  <AddIcon />
                </Button>
              </Flex>
            </Text>

            <Button
              rounded={"none"}
              w={"full"}
              mt={8}
              size={"lg"}
              py={"7"}
              bg={useColorModeValue("gray.900", "gray.50")}
              color={useColorModeValue("white", "gray.900")}
              textTransform={"uppercase"}
              _hover={{
                transform: "translateY(2px)",
                boxShadow: "lg",
              }}
              onClick={addtocart}
              isDisabled={count ? false : true}
            >
              Add to cart
            </Button>
          </Flex> */}
            </Stack>
          </Box>
          <Box
            style={{
              flexBasis: "40% ",
              boxShadow: "1px 5px 10px #aaaaaa",
              margin: "5px",
              padding: "20px",
              height: "220px",
            }}
          >
            <Center>
              <Heading lineHeight={1.1} fontWeight={600} fontSize={20} mb={8}>
                Add To Cart
              </Heading>
            </Center>
            <Text fontWeight={600} size="md" my={2}>
              <Flex direction={"row"} justifyContent={"space-evenly"}>
                <Button
                  bg={useColorModeValue("gray.900", "gray.50")}
                  color={useColorModeValue("white", "gray.900")}
                  size="md"
                  value="-"
                  id="moinsminus"
                  onClick={handleCount}
                  isDisabled={count ? false : true}
                >
                  <MinusIcon />
                </Button>
                {count}{" "}
                {/* if iteam is alrady present in cart then that is reamin */}
                <Button
                  bg={useColorModeValue("gray.900", "gray.50")}
                  color={useColorModeValue("white", "gray.900")}
                  size="md"
                  value="+"
                  id="moinsplus"
                  onClick={handleCount}
                >
                  <AddIcon />
                </Button>
              </Flex>
            </Text>

            <Button
              rounded={"none"}
              w={"full"}
              mt={8}
              size={"lg"}
              py={"7"}
              bg={useColorModeValue("gray.900", "gray.50")}
              color={useColorModeValue("white", "gray.900")}
              textTransform={"uppercase"}
              _hover={{
                transform: "translateY(2px)",
                boxShadow: "lg",
              }}
              onClick={addtocart}
              isDisabled={count ? false : true}
            >
              Add to cart
            </Button>
          </Box>
        </Flex>
      </Flex>
    </Container>
  );
}

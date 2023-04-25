import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Product from "../partials/ProductCard";
import Cart_product_card from "../partials/Cart_product_card";
import { ArrowForwardIcon, TimeIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../API/api_url";
import showToast from "../partials/showToast";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
  Heading,
  Avatar,
  Center,
  Box,
  Container,
  Divider,
  Button,
  Flex,
  Stack,
  Text,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Input,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";

export default function DisplayCartProduct() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [cartProducts, setCartProducts] = useState([]);
  const { shop_id } = useParams();
  const [pickupTime, setPickupTime] = useState("");
  const [amount, setAmount] = useState(0);
  const [productDetails, setProductDetails] = useState(""); // array of all product that added in cart
  const [orderData, setOrderData] = useState({});
  useEffect(() => {
    loadScript("https://checkout.razorpay.com/v1/checkout.js");
  });
  const navigate = useNavigate();

  const fetchData = async () => {
    const response = await axios.get(`${API}/api/getcart/${shop_id}`);
    if (response.data.statusCode === 200) {
      console.log(response.data.data[0].productIds);
      setCartProducts(response.data.data[0].productIds);
    }
  };

  const calAmountAndPD = () => {
    let tamount = 0;
    let tproduct_details = [];
    // console.log("Calculated")
    tproduct_details = cartProducts.map((value, index) => {
      console.log(value);
      tamount += value.productId.price * value.quantity;
      return {
        productId: value.productId._id,
        quantity: value.quantity,
      };
    });
    setAmount(tamount);
    setProductDetails(tproduct_details);
  };
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    calAmountAndPD();
  }, [cartProducts]);

  const handleInputChange = (e) => {
    setPickupTime(e.target.value);
  };

  const isStockAvailable = async () => {
    const data = productDetails.map(async (val, index) => {
      const productDetail = await axios.get(
        `${API}/api/productDetail/${val.productId}`
      );
      console.log(
        "stock",
        productDetail.data.userdata.stock,
        " ",
        val.quantity
      );
      if (productDetail.data.userdata.stock - val.quantity >= 0) {
        return true;
      } else {
        console.log("instai......");
        return false;
      }
    });
    return data;
  };

  // Place order
  const PlaceOrder = async () => {
    setPickupTime("");
    // console.log("placing order")
    const order_detail = {
      shopId: shop_id,
      product_details: productDetails,
      amount: amount,
      pickup_time: pickupTime,
    };
    console.log(order_detail);

    const response = await axios.post(`${API}/api/makeOrder`, order_detail);
    // console.log(response.data)

    if (response.data.statusCode === 200) {
      // Delete from cart
      console.log("Opening model");
      setOrderData(response.data.orderData);
      onOpen();
    } else {
      alert("Error While doing order");
    }
  };

  // Remove items from cart
  const removeFromCart = async (productId) => {
    console.log("Removing");
    console.log(cartProducts);
    setCartProducts(
      cartProducts.filter((value) => {
        // console.log("----", value, value.productId._id, )
        return value.productId._id !== productId;
      })
    );
    // console.log(`${API}/api/remove/${shop_id}/${productId}`)
    const result = await axios.get(`${API}/api/remove/${shop_id}/${productId}`);
    if (result.data.statusCode === 200) {
      console.log("Product remove from cart in DB");
      // show alert here
    } else {
      console.error("Error while Removing product");
    }
  };

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  const displayRazorpay = async () => {
    Promise.all(await isStockAvailable())
      .then(async (res) => {
        console.log("result", res);
        let checker = (arr) => arr.every((v) => v === true);
        const istrue = checker(res);
        return istrue;
      })
      .then(async (istrue) => {
        if (!istrue) {
          alert("Stock is not available.");
          return;
        } else {
          const data = await axios.post(`${API}/api/razorpay`, {
            amount: amount * 100,
            productDetails,
          });
          //.then((t) => t.json());
          console.log(data);
          const options = {
            key: "rzp_test_7WR4xIlnq2U8Bk",
            currency: data.data.currency,
            amount: data.data.amount,
            name: "Learn Code Online",
            description: "Wallet Transaction",
            image: "http://localhost:1337/logo.png",
            order_id: data.data.id,
            handler: async function (response) {
              alert("PAYMENT ID ::" + response.razorpay_payment_id);
              alert("ORDER ID :: " + response.razorpay_order_id);
              await PlaceOrder();
            },

            prefill: {
              name: "Anirudh Jwala",
              email: "anirudh@gmail.com",
              contact: "9999999999",
            },
            modal: {
              ondismiss: function () {
                showToast(toast, {
                  title: "Payment failed",
                  description: "Payment failed due to some error.",
                  status: "error",
                });
              },
            },
          };
          console.log(".............");
          const paymentObject = new window.Razorpay(options);
          paymentObject.open();
        }
      });
  };

  return (
    <>
      {/* This is for opening model on success fully order placed */}
      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        size={"lg"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Thank you for your order</ModalHeader>
          {/* <ModalCloseButton /> */}
          <ModalBody pb={6}>
            <Center py={6}>
              <Box
                // maxW={'320px'}
                w={"full"}
                bg={useColorModeValue("white", "gray.700")}
                // boxShadow={'2xl'}
                rounded={"lg"}
                p={6}
                textAlign={"center"}
              >
                <Avatar
                  size={"xl"}
                  src={`${process.env.PUBLIC_URL}/Images/Success.png`}
                  alt={"Avatar Alt"}
                  mb={4}
                  pos={"relative"}
                />
                <Heading fontSize={"2xl"} fontFamily={"body"}>
                  Order submitted !
                </Heading>
                <Text fontWeight={600} color={"gray.500"} mb={4} mt={2}>
                  Thanks for submitting your order.
                </Text>
                <Text
                  textAlign={"center"}
                  color={useColorModeValue("gray.700", "gray.400")}
                  px={3}
                >
                  {/* <Box mt={1}>
                    <Text fontWeight={600} as="span">
                      Order Id:{" "}
                    </Text>
                    <Text as="span"> {orderData._id} </Text>
                  </Box> */}

                  <Box mt={1}>
                    <Text fontWeight={600} as="span">
                      Amount:{" "}
                    </Text>
                    <Text as="span"> {orderData.amount} </Text>
                  </Box>

                  <Box mt={1}>
                    <Text fontWeight={600} as="span">
                      Secure Code:{" "}
                    </Text>
                    <Text as="span"> {orderData.secure_code} </Text>
                  </Box>

                  <Box mt={1}>
                    <Text fontWeight={600} as="span">
                      Pick up time:{" "}
                    </Text>
                    <Text as="span"> {orderData.pickup_time} </Text>
                  </Box>
                </Text>
              </Box>
            </Center>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                navigate("/displayshops");
                onClose();
              }}
            >
              Explore More
            </Button>
            {/* <Button onClick={onClose}>Cancel</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* This is file main ui code */}
      <Container
        maxW={"1000px"}
        bg={useColorModeValue("gray.100", "gray.700")}
        my={5}
        p={3}
        borderRadius={"md"}
      >
        <Flex direction={"row"} justifyContent={"space-around"}>
          <Box>
            {cartProducts.length > 0 ? (
              cartProducts.map((value, index) => (
                <Box key={index}>
                  <Cart_product_card
                    name={value.productId.name}
                    imageURL={
                      value.productId.images
                        ? value.productId.images[0].imageUrl
                        : ""
                    }
                    price={value.productId.price}
                    description={value.productId.description}
                    quantity={value.quantity}
                    productLink={`/product/${value.productId.shop_id}/${value.productId._id}`}
                    product_id={value.productId._id}
                    removeItem={removeFromCart}
                  />
                </Box>
              ))
            ) : (
              <h3>No products found</h3>
            )}
            {/* <Cart_product_card /> */}
            {/* <Cart_product_card /> */}
          </Box>
          <Box mt={3}>
            <Box
              bg={useColorModeValue("white", "gray.900")}
              borderRadius={"lg"}
              maxWidth={"200px"}
              p={4}
              height={"160px"}
              boxShadow={"md"}
            >
              <Flex direction={"row"} justifyContent={"space-between"} my={2}>
                <Text>SubCost: </Text>
                <Text>{amount}</Text>
              </Flex>
              <Flex direction={"row"} justifyContent={"space-between"} my={3}>
                <Text>Charges: </Text>
                <Text>{"+ 0.00"}</Text>
              </Flex>
              <Divider />
              <Flex
                direction={"row"}
                justifyContent={"space-between"}
                my={3}
                fontWeight={600}
              >
                <Text>Total: </Text>
                <Text>{amount}</Text>
              </Flex>
            </Box>
            <Box width={"200px"}>
              <Stack mt={3}>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    fontSize="1.2em"
                    children={<TimeIcon />}
                  />
                  <Input
                    placeholder="Enter Pickup time"
                    value={pickupTime}
                    onChange={handleInputChange}
                    boxShadow={"md"}
                  />
                </InputGroup>
              </Stack>
              <Button
                rightIcon={<ArrowForwardIcon />}
                colorScheme="blue"
                variant="solid"
                width={"100%"}
                my={5}
                onClick={displayRazorpay}
                isDisabled={pickupTime ? false : true}
                boxShadow={"xl"}
              >
                Place Order
              </Button>
            </Box>
          </Box>
        </Flex>
      </Container>

      {/* <Flex justifyContent={'space-around'} alignContent={'space-between'} wrap={'wrap'}>
				{

					cartProducts.length > 0 ? cartProducts.map((value, index) => (
						<Box key={index}>
							<Link href={`/product/${value.productId.shop_id}/${value.productId._id}`}>
								<Product
									name={value.productId.name}
									imageURL={value.productId.image ? process.env.PUBLIC_URL + `/upload/images/${value.productId.image.imgId}` : ""}
									price={value.productId.price}
									description={value.productId.description}
								/>
							</Link>
						</Box>
					))
						: <h3>No products found</h3>
				}
			</Flex> */}
    </>
  );
}

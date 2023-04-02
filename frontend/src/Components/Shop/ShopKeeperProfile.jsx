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
  Center,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import showToast from "../partials/showToast";
import { useNavigate } from "react-router-dom";
import { API } from "../API/api_url";
import { Avatar } from "evergreen-ui";
const axios = require("axios");

export default function ShopKeeperProfile() {
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
  const [profileImage, setProfileImage] = useState({
    imageUrl: "",
    publicId: "",
  });
  const [profileImg, setProfileImg] = useState("");
  const [isUpdateUrl, setIsUpdateUrl] = useState(false);
  useEffect(() => {
    getShopDetail();
  }, []);

  const handleImage = async (e) => {
    try {
      const formData = new FormData();
      formData.append("file", profileImg);
      formData.append("upload_preset", "smiteshmaniya");

      // Make an AJAX upload request using Axios (replace Cloudinary URL below with your own)
      const fileData = await axios.post(
        "https://api.cloudinary.com/v1_1/dhybpb2nf/image/upload",
        formData,
        {
          headers: { "X-Requested-With": "XMLHttpRequest" },
        }
      );
      return fileData;
    } catch (error) {
      return null;
    }
  };

  const getShopDetail = async (req, res) => {
    try {
      console.log("h");
      const result = await axios.get(`${API}/api/one_shop`);
      const data = result.data.userdata;
      setShopDetail({
        shop_name: data.shop_name,
        email: data.email,
        phone_number: data.phone_number,
        owner_name: data.owner_name,
        address: data.address,
        area: data.area,
        city: data.city,
        pincode: data.pincode,
        start_time: data.start_time,
        end_time: data.end_time,
      });
      setProfileImage({
        imageUrl: data.profileImage.imageUrl,
        publicId: data.profileImage.publicId,
      });
      console.log("result is", result);
    } catch (err) {
      console.log("error...", err);
    }
  };
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
      setIsBtnLoading(true);

      let profileImageJson, compeleteUserDetail;
      if (true) {
        let imageData;
        console.log("profileImage: ", profileImg);
        imageData = await handleImage();
        console.log("imageData", imageData);

        if (imageData == null) {
          profileImageJson = {
            ...profileImage,
          };
        } else {
          profileImageJson = {
            imageUrl: imageData.data.url,
            publicId: imageData.data.public_id,
          };

          localStorage.setItem("profileUrl", imageData.data.url);
        }
        console.log("image...", profileImageJson);
        compeleteUserDetail = {
          ...shopDetail,
          profileImage: profileImageJson,
        };
      }
      console.log("compelteuserdetail: ", compeleteUserDetail);

      const res = await axios.put(
        `${API}/api/shop_register`,
        compeleteUserDetail
      );
      console.log("res is", res.data);
      setIsBtnLoading(false);
      if (res.data.statusCode === 200) {
        setShopDetail(initalData);
        ShowToast({
          title: "Success!",
          description: res.data.message,
          status: "success",
        });
        getShopDetail();
        window.location.reload();
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
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"} textAlign={"center"}>
              Profile
            </Heading>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              <FormControl id="userName">
                <FormLabel>User Image</FormLabel>
                <Stack direction={["column", "row"]} spacing={6}>
                  <Center>
                    <Avatar
                      size="sm"
                      src={profileImage.imageUrl}
                      height={60}
                    ></Avatar>
                  </Center>
                  <Center w="full">
                    <Input
                      type="file"
                      name="files"
                      onChange={(e) => setProfileImg(e.target.files[0])}
                    />
                  </Center>
                </Stack>
              </FormControl>
              <FormControl id="shop_name" isRequired>
                <FormLabel>Shop Name</FormLabel>
                <Input
                  type="text"
                  name="shop_name"
                  onChange={inputHandler}
                  value={shopDetail.shop_name}
                />
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
                  Update
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </>
  );
}

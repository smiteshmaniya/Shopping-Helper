import React, { useEffect } from "react";
import { API } from "../API/api_url";
import {
  FormControl,
  FormLabel,
  Flex,
  Box,
  Input,
  InputGroup,
  Stack,
  Button,
  Heading,
  useColorModeValue,
  Textarea,
  useToast,
  HStack,
  Text,
  Center,
} from "@chakra-ui/react";
import { useState } from "react";
import showToast from "../../Components/partials/showToast";
import { TagInput } from "evergreen-ui";
import { useParams } from "react-router-dom";
const axios = require("axios");

const ShowImage = (props) => {
  return (
    <>
      <HStack spacing="24px">
        <img src={URL.createObjectURL(props.files)} width={100} />
        <Box>
          <Button
            onClick={props.deleteImage}
            fontSize={10}
            h={5}
            name={props.index}
          >
            {" "}
            Remove
          </Button>
        </Box>
      </HStack>
    </>
  );
};

const ShowDefaultImage = (props) => {
  return (
    <HStack spacing="24px">
      {console.log("i.........")}
      <img src={props.image.imageUrl} width={100} />
      <Box>
        <Button onClick={props.deleteDefaultImage} fontSize={10} h={5}>
          {" "}
          Remove
        </Button>
      </Box>
    </HStack>
  );
};

export default function EditShopProduct() {
  const toast = useToast();
  const initalValue = {
    name: "",
    description: "",
    stock: "",
    price: "",
  };
  const [productDetail, setproductDetail] = useState(initalValue);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const { proudctId } = useParams();
  const [defaultImages, setDefaultImages] = useState("");

  useEffect(() => {
    getProductDetail();
  }, []);

  const deleteImage = (ind) => {
    var newImages = files.filter((val, index) => index != ind);
    setFiles(newImages);
  };

  const deleteDefaultImage = async (publicId) => {
    var updatedImages = defaultImages.filter((val) => val.publicId != publicId);
    console.log("update: ", updatedImages);
    setDefaultImages(updatedImages);
  };

  const getProductDetail = async () => {
    try {
      console.log("in ");
      const data = await axios.get(`${API}/api/productDetail/${proudctId}`);
      console.log("one product data: ", data);
      setproductDetail({
        name: data.data.userdata.name,
        description: data.data.userdata.description,
        price: data.data.userdata.price,
        stock: data.data.userdata.stock,
      });
      setTags(data.data.userdata.tags);
      console.log("tags:", productDetail.tags);
      setDefaultImages(data.data.userdata.images);
    } catch (err) {
      console.log("error: ", err);
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
    setproductDetail((preVal) => {
      return {
        ...preVal,
        [name]: value,
      };
    });
  };

  // const inputImage = (e) => {
  //   console.log(e.target.files[0]);
  //   setImage(e.target.files[0]);
  // };

  var arr = [];
  const handleDrop = async () => {
    // Push all the axios request promise into a single array

    const uploaders = files.map((file) => {
      // Initial FormData

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "smiteshmaniya");

      // Make an AJAX upload request using Axios (replace Cloudinary URL below with your own)
      return axios
        .post(
          "https://api.cloudinary.com/v1_1/dhybpb2nf/image/upload",
          formData,
          {
            headers: { "X-Requested-With": "XMLHttpRequest" },
          }
        )
        .then((response) => {
          const data = response.data;

          // console.log(data);
          arr.push({ imageUrl: data.url, publicId: data.public_id });
        });
    });

    // Once all the files are uploaded
    await axios.all(uploaders).then(() => {
      // ... perform after upload is successful operation
      console.log("files uploaded... ", arr);
    });
  };

  const onsubmit = async (e) => {
    e.preventDefault();
    setIsBtnLoading(true);
    console.log("Add product images...", files);
    setIsLoading(true); // displaying spinner in button
    e.preventDefault();
    await handleDrop();
    console.log("arr of images...", arr);
    const token = localStorage.getItem("token");

    const productDetail_split = {
      ...productDetail,
      images: [...arr, ...defaultImages],
      tags: tags,
    };
    console.log("Product Detail: ", productDetail_split);
    try {
      const res = await axios.put(
        `${API}/api/productDetail/${proudctId}`,
        productDetail_split
      );

      console.log("result of addproduct: ", res);
      console.log("code.", res.data.stautsCode);
      if (res.data.stautsCode === 200) {
        //setproductDetail(initalValue);
        getProductDetail();
        setFiles([]);
        ShowToast({
          title: "Success!",
          description: res.data.message,
          status: "success",
        });
      } else {
        ShowToast({
          title: "Error!",
          description: "Proudct detail not updated",
          status: "error",
        });
      }

      setIsBtnLoading(false);
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
        minH={"90vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} maxW={700} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"} textAlign={"center"}>
              Edit Your Product
            </Heading>
          </Stack>
          <HStack>
            <Box
              rounded={"lg"}
              bg={useColorModeValue("white", "gray.700")}
              boxShadow={"lg"}
              p={8}
              h={500}
            >
              <Stack spacing={4}>
                <FormControl id="name" isRequired>
                  <FormLabel>Product Name</FormLabel>
                  <Input
                    type="text"
                    name="name"
                    onChange={inputHandler}
                    value={productDetail.name}
                  />
                </FormControl>

                <FormControl id="description" isRequired>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    placeholder="Add your detailed product description"
                    name="description"
                    onChange={inputHandler}
                    value={productDetail.description}
                    cols={10}
                    rows={7}
                  />
                  {/* <Input type="text"  /> */}
                </FormControl>

                <Stack spacing={5} direction="row">
                  <FormControl id="stock" isRequired>
                    <FormLabel>Stock</FormLabel>
                    <InputGroup>
                      <Input
                        type="text"
                        name="stock"
                        onChange={inputHandler}
                        value={productDetail.stock}
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl id="price" isRequired>
                    <FormLabel>Price</FormLabel>
                    <Input
                      type="text"
                      name="price"
                      onChange={inputHandler}
                      value={productDetail.price}
                    />
                  </FormControl>
                </Stack>

                <FormControl id="tags" isRequired>
                  <FormLabel>Tags</FormLabel>

                  <TagInput
                    defaultValue={tags}
                    backgroundColor={"#2D3748"}
                    borderColor={"inherit"}
                    width={335}
                    inputProps={{ placeholder: "Add Names.." }}
                    onChange={(data) => {
                      setTags(data);
                    }}
                    values={tags}
                  />
                </FormControl>
              </Stack>
            </Box>
            <Box
              rounded={"lg"}
              bg={useColorModeValue("white", "gray.700")}
              boxShadow={"lg"}
              p={8}
              w={300}
              h={500}
            >
              <Stack spacing={4}>
                <FormControl id="files" isRequired mb={"7px"}>
                  <FormLabel>Product Images</FormLabel>

                  <label htmlFor="productImages">upload</label>
                  <Input
                    id="productImages"
                    type="file"
                    style={{ display: "none" }}
                    name="files"
                    onChange={(e) =>
                      setFiles((preImg) => [...preImg, e.target.files[0]])
                    }
                  />
                </FormControl>
                <FormControl>
                  {defaultImages.length > 0
                    ? defaultImages.map((image, ind) => {
                        return (
                          <ShowDefaultImage
                            image={image}
                            deleteDefaultImage={(e) =>
                              deleteDefaultImage(image.publicId)
                            }
                          />
                        );
                      })
                    : ""}

                  {files
                    ? files.map((file, ind) => {
                        return (
                          <ShowImage
                            files={file}
                            index={ind}
                            deleteImage={(e) => deleteImage(ind)}
                          />
                        );
                      })
                    : ""}
                </FormControl>
                {/* <FormControl>
                  {files.map((file, ind) => {
                    return (
                      <HStack spacing="24px">
                        <img
                          src={URL.createObjectURL(file.imageUrl)}
                          width={100}
                        />
                        <Box>
                          <Button fontSize={10} h={5}>
                            Remove
                          </Button>
                        </Box>
                      </HStack>
                    );
                  })}
                </FormControl> */}
              </Stack>
            </Box>
          </HStack>
          <Center>
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
                isLoading={isBtnLoading}
              >
                Update Product
              </Button>
            </Stack>
          </Center>
        </Stack>
      </Flex>
    </>
  );
}

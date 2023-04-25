import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Product from "../partials/ProductCard";
import { Center, Flex, Heading, Button, Input } from "@chakra-ui/react";
import { API } from "../API/api_url";
import { Link } from "react-router-dom";
import { SearchIcon } from "@chakra-ui/icons";

export default function ShopProducts() {
  const [allProduct, setallProduct] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isProductSearched, setIsProductSearched] = useState(false);
  const [productSearched, setProductSearched] = useState(false);
  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    console.log("hello");
    const shop = await axios.get(`${API}/api/productDetail/shop`);
    console.log("shop products: ", shop);
    setallProduct(shop.data.products);
  };

  const handleOnsearch = async () => {
    setIsProductSearched(true);
    if (searchInput == null) setIsProductSearched(false);

    setProductSearched(
      allProduct.filter((val) => {
        return val.name.toLowerCase().search(searchInput.toLowerCase()) != -1;
      })
    );
    // const result = await axios.get(
    //   `${API}/api/productDetail/getbysearch/${searchInput}`
    // );
    // console.log("result of search: ", result.data);
    // setallProduct(result.data.products);
  };
  const handleInput = async (e) => {
    setSearchInput(e.target.value);
  };

  return (
    <div>
      <Center mt={3}>
        <Input
          placeholder="Search Your Product"
          w={"500px"}
          onChange={handleInput}
        />
        <Button ml={2} onClick={handleOnsearch}>
          <SearchIcon />
        </Button>
      </Center>
      <Center>
        <Heading
          mt={7}
          lineHeight={1.1}
          fontWeight={600}
          fontSize={30}
          mb={8}
          textTransform={"capitalize"}
        >
          Shop Products
        </Heading>
      </Center>

      {/* {allProduct} */}
      {/* {allProduct.map((val) => console.log('hello'))} */}
      {/* <Products allProduct={allProduct} /> */}
      {
        <Flex
          justifyItems={"self-start"}
          justifyContent={"space-around"}
          alignContent={"space-between"}
          wrap={"wrap"}
        >
          {isProductSearched == false
            ? allProduct?.length > 0 &&
              allProduct.map((val, ind) => (
                <Link to={`/editproduct/${val._id}`}>
                  <Product
                    id={val._id}
                    name={val.name}
                    description={val.description}
                    price={val.price}
                    stock={val.stock}
                    imageURL={
                      val.images.length > 0 ? val.images[0].imageUrl : ""
                    }
                  />
                </Link>
              ))
            : productSearched.map((val, ind) => (
                <Link to={`/editproduct/${val._id}`}>
                  <Product
                    id={val._id}
                    name={val.name}
                    description={val.description}
                    price={val.price}
                    stock={val.stock}
                    imageURL={
                      val.images.length > 0 ? val.images[0].imageUrl : ""
                    }
                  />
                </Link>
              ))}
        </Flex>
      }
    </div>
  );
}

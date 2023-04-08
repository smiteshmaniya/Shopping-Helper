import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Product from "../partials/ProductCard";
import { Center, Flex, Heading } from "@chakra-ui/react";
import { API } from "../API/api_url";
import { Link } from "react-router-dom";
export default function ShopProducts() {
  const [allProduct, setallProduct] = useState("");
  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    console.log("hello");
    const shop = await axios.get(`${API}/api/productDetail/shop`);
    console.log("shop products: ", shop);
    setallProduct(shop.data.products);
  };
  return (
    <div>
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
          {allProduct?.length > 0 &&
            allProduct.map((val, ind) => (
              <Link to={`/editproduct/${val._id}`}>
                <Product
                  id={val._id}
                  name={val.name}
                  description={val.description}
                  price={val.price}
                  stock={val.stock}
                  imageURL={val.images.length > 0 ? val.images[0].imageUrl : ""}
                />
              </Link>
            ))}
        </Flex>
      }
    </div>
  );
}

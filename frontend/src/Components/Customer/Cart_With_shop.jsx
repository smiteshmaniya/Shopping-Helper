import { Center, Flex, Heading } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Shop_card from "../partials/Shop_card";
export default function Cart_With_shop() {
  const [shops, setShops] = useState([]);

  const fetchData = async () => {
    const response = await axios.get("/api/getcart");
    console.log(response.data);
    if (response.data.statusCode == 200) {
      setShops(response.data.data);
      // console.log(response.data.data)
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Heading mt={"20px"} isTruncated>
        <Center>Cart with shops</Center>
      </Heading>
      <Flex
        justifyContent={"space-around"}
        alignContent={"space-between"}
        wrap={"wrap"}
      >
        {
          shops.length > 0 ? (
            shops.map((value, index) => (
              <Shop_card
                key={index}
                shopId={value.shopId._id}
                shop_name={value.shopId ? value.shopId.shop_name : ""}
                owner_name={value.shopId ? value.shopId.owner_name : ""}
                address={value.shopId ? value.shopId.address : ""}
                area={value.shopId ? value.shopId.area : ""}
                city={value.shopId ? value.shopId.city : ""}
                pincode={value.shopId ? value.shopId.pincode : ""}
                start_time={value.shopId ? value.shopId.start_time : ""}
                end_time={value.shopId ? value.shopId.end_time : ""}
                onClickLink={`/cartproducts/${value.shopId._id}`}
                btnText={"View Cart Products"}
              />
            ))
          ) : (
            <h3>No item in cart</h3>
          )
          //   products.length > 0 ? products.map((value, index) => (
          //     <Box key={index}>
          //       <Link href={`/product/${value.shop_id}/${value._id}`}>
          //         <Product
          //           name={value.name}
          //           imageURL={value.image ? process.env.PUBLIC_URL + `/upload/images/${value.image.imgId}` : ""}
          //           price={value.price}
          //           description={value.description}
          //         />
          //       </Link>
          //     </Box>
          //   ))
          //     : <h3>No products found</h3>
        }
      </Flex>
    </>
  );
}

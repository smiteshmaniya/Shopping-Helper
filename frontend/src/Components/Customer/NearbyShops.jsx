import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../API/api_url";
import Shop_card from "../partials/Shop_card";
import { Button, Center, Flex, Heading, Input, Text } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

export default function NearbyShops() {
  const [shops, setshops] = useState([]);
  const [userInput, setUserInput] = useState("");
  useEffect(() => {
    getAllShop();
  }, []);

  useEffect(() => {}, [shops]);

  const getAllShop = async () => {
    // console.log('s///')
    const shops = await axios.get(`${API}/api/shop_register`);
    setshops(shops.data.userdata);
    console.log("shops are: ", shops);
  };

  return (
    <>
      <Heading mt={"20px"} isTruncated>
        <Center>Nearby Shops</Center>
      </Heading>
      <Flex
        justifyContent={"space-around"}
        alignContent={"space-between"}
        wrap={"wrap"}
      >
        {shops.length > 0 ? (
          shops.map((val, ind) => (
            <Shop_card
              key={ind}
              shop_id={val._id}
              shop_name={val.shop_name}
              owner_name={val.owner_name}
              address={val.address}
              area={val.area}
              city={val.city}
              pincode={val.pincode}
              start_time={val.start_time}
              end_time={val.end_time}
              onClickLink={`/shopproducts/${val._id}`}
              btnText={"View Products"}
            />
          ))
        ) : (
          <Text fontSize="md">No Shop Found.</Text>
        )}
      </Flex>
    </>
  );
}

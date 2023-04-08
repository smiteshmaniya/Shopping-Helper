import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../API/api_url";
import Shop_card from "../partials/Shop_card";
import { Button, Center, Flex, Heading, Input, Text } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import ProductWithShops from "./ProductWithShops";

export default function DisplayShops() {
  const [shops, setshops] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isPincode, setIsPincode] = useState(true);
  const [pincode, setPincode] = useState("");
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

  const handleInput = (e) => {
    setUserInput(e.target.value);
  };
  const handleSearch = async () => {
    if (userInput == null || userInput.trim().length == 0) {
      setIsPincode(true);
      getAllShop();
    } else if (!isNaN(userInput)) {
      const search = await axios.get(`${API}/api/searchShop/${userInput}`);
      console.log(search);
      if (search.status == 200) {
        setshops(search.data.userdata);
        setIsPincode(true);
      } else {
        setshops([]);
      }
    } else {
      const search = await axios.get(`${API}/api/searchProduct/${userInput}`);
      const pincode = await axios.get(`${API}/api/getUserPincode`);
      if (search.status == 200 && pincode.status == 200) {
        setPincode(pincode.data.pincode);
        setshops(search.data.userdata);
        setIsPincode(false);
        console.log(search.data.userdata);
      } else {
        setshops([]);
      }
    }
  };
  return (
    <>
      <Center mt={3}>
        <Input
          placeholder="Search shop by Pincode or search Item Name"
          w={"500px"}
          onChange={handleInput}
        />
        <Button ml={2} onClick={handleSearch}>
          <SearchIcon />
        </Button>
      </Center>
      <Heading mt={"20px"} isTruncated>
        <Center>Shops & Items</Center>
      </Heading>
      <Flex
        justifyContent={"space-around"}
        alignContent={"space-between"}
        wrap={"wrap"}
      >
        {!isPincode ? (
          shops.length > 0 ? (
            shops.map((val, ind) => (
              <ProductWithShops
                key={ind}
                userPincode={pincode}
                id={val._id}
                product_name={val.name}
                price={val.price}
                description={val.description}
                images={val.images[0].imageUrl}
                shop_details={val.shop_id}
              />
            ))
          ) : (
            <Text fontSize="md" color={"red"} mt={"10px"}>
              No product found as {userInput}.
            </Text>
          )
        ) : shops.length > 0 ? (
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

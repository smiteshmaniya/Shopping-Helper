import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../API/api_url";
// import OrderProducts_ShopCard from './OrderProducts_ShopCard';
import { Center, Heading, Text } from "@chakra-ui/react";
import OrderProducts_ShopCard from "../Shop/OrderProducts_ShopCard";

export default function Order_History() {
  const [orderDetail, setOrderDetail] = useState([]);
  const fetchData = async () => {
    const orders = await axios.get(`${API}/api/orders`);
    setOrderDetail(orders.data.userdata);
    console.log(orders.data.userdata);
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <Heading mt={"20px"} isTruncated>
        <Center>Order History</Center>
      </Heading>
      {orderDetail.length > 0 ? (
        orderDetail.map((val, ind) => (
          <OrderProducts_ShopCard
            orderId={val._id}
            key={ind}
            amount={val.amount}
            pickup_time={val.pickup_time}
            product_details={val.product_details}
            secure_code={val.secure_code}
            order_status={val.order_status}
            iscustomer={true}
            onClick={() => {}}
          />
        ))
      ) : (
        <Center>
          {" "}
          <Text fontSize={"16px"} my={3}>
            {" "}
            No order{" "}
          </Text>{" "}
        </Center>
      )}
    </>
  );
}

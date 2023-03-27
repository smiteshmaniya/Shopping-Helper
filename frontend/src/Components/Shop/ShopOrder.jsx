import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { API } from '../../API/api_url'
import OrderProducts_ShopCard from './OrderProducts_ShopCard';
import { Center, Heading, Text } from '@chakra-ui/react';



export default function ShopOrder() {

    const [orderDetail, setOrderDetail] = useState([]);
    const [status, setStatus] = useState(''); // status of wheather order is success or not
    useEffect(() => {
        fetchData();
    }, [status])

    const fetchData = async () => {
        console.log('inside order....')
        const orders = await axios.get(`${API}/api/shopOrders`);
        console.log(orders.data.userdata)
        setOrderDetail(orders.data.userdata)
    }

    const completeOrder = async (orderId) => {
        console.log("Called again");
        const success = await axios.put(`${API}/api/orderStatus/${orderId}`, {});
        setStatus(success.data);
        
    }

    return (

        <>
            <Heading mt={'20px'} isTruncated>
                <Center>
                    Order Details
                </Center>
            </Heading>
            {
                orderDetail.length > 0 ? orderDetail.map((val, ind) => (
                    <OrderProducts_ShopCard
                        orderId={val._id}
                        key={ind}
                        amount={val.amount}
                        pickup_time={val.pickup_time}
                        product_details={val.product_details}
                        secure_code={val.secure_code}
                        order_status={val.order_status}
                        onClick={() => {completeOrder(val._id)}}
                    />
                )) : <Center> <Text  fontSize={'16px'} my={3}> No order </Text> </Center>
            }
        </>
    )
}

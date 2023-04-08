import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API } from '../../API/api_url';
import Product  from "../partials/ProductCard";
export default function DisplayCart() {
    const [cart, setCart] = useState([]);
    const fetchCartDetail = async () => {
        const products = await axios.get(`${API}/api/getcart`);
        // console.log(products.data)
    }
    useEffect(() => {
      fetchCartDetail();
    }, [])
  return (
    <>
        {
          cart.map((value, index) => (
            <Product 
              key={index}
              name={value.name} 
              imageURL={process.env.PUBLIC_URL + `/upload/images/${value.image.imgId}`} 
              price={value.price} 
              description={value.description} 
            />
          ))
        }
    </>
  )
}

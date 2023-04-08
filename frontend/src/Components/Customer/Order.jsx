import React from 'react'
import { API } from "../../API/api_url";
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
} from '@chakra-ui/react'
import { useState } from 'react'
const axios = require('axios')

export default function AddProduct() {
    const initalValue = {
        shopId: '',
        product_details: [],
        amount: '',
        payment_method: '',
    }
    const [productDetail, setproductDetail] = useState(initalValue)
    const [image, setImage] = useState('')

    const inputHandler = (e) => {
        const { name, value } = e.target;
        // console.log(name, value)
        setproductDetail((preVal) => {
            return {
                ...preVal,
                [name]: value
            }
        })
    }

    const inputImage = (e) => {
        console.log(e.target.files[0])
        setImage(e.target.files[0])
    }

    const onsubmit = async (e) => {
        e.preventDefault();
        // console.log(productDetail);
        const res = await axios.post(`${API}/api/productDetail`, productDetail)
        console.log(res);
        console.log('res is', res, 'id is', res.data.productDetail._id)

        const formData = new FormData()
        formData.append('productImage', image)
        const res2 = await axios.post(`${API}/api/upload/${res.data.productDetail._id}`, formData, image)

        console.log(res2)
        if (res.data.statusCode === 200) {
            setproductDetail(initalValue);
            alert(res.data.message)
            setImage('');
        } else {
            console.log('')
            alert(res.data.message)
        }
    }

    return (
        <>
            <Flex
                minH={'90vh'}
                align={'center'}
                justify={'center'}
                bg={useColorModeValue('gray.50', 'gray.800')}>
                <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                    <Stack align={'center'}>
                        <Heading fontSize={'4xl'} textAlign={'center'}>
                            Add New Product
                        </Heading>
                    </Stack>
                    <Box
                        rounded={'lg'}
                        bg={useColorModeValue('white', 'gray.700')}
                        boxShadow={'lg'}
                        p={8}
                    >
                        <Stack spacing={4}>
                            <FormControl id="name" isRequired>
                                <FormLabel>Product Name</FormLabel>
                                <Input type="text" name="name" onChange={inputHandler} value={productDetail.name} />
                            </FormControl>

                            <FormControl id="description" isRequired>
                                <FormLabel>Description</FormLabel>
                                <Textarea placeholder='Add your detailed product description' name="description" onChange={inputHandler} value={productDetail.description} />
                                {/* <Input type="text"  /> */}
                            </FormControl>


                            <FormControl id="image" isRequired>
                                <FormLabel>Image</FormLabel>
                                <Input type="file" name="image" onChange={inputImage} /> {/* Value not given here check that */}
                            </FormControl>


                            <Stack spacing={5} direction='row'>
                                <FormControl id="stock" isRequired>
                                    <FormLabel>Stock</FormLabel>
                                    <InputGroup>
                                        <Input type='text' name='stock' onChange={inputHandler} value={productDetail.stock} />
                                    </InputGroup>
                                </FormControl>

                                <FormControl id="price" isRequired>
                                    <FormLabel>Price</FormLabel>
                                    <Input type="text" name="price" onChange={inputHandler} value={productDetail.price} />
                                </FormControl>
                            </Stack>

                            <FormControl id="tags" isRequired>
                                <FormLabel>Tags</FormLabel>
                                <Input type="text" name="tags" onChange={inputHandler} value={productDetail.tags} placeholder='add tegs sepreted by comma' />
                            </FormControl>


                            <Stack spacing={10} pt={2}>
                                <Button
                                    loadingText="Submitting"
                                    size="lg"
                                    bg={'blue.400'}
                                    color={'white'}
                                    onClick={onsubmit}
                                    _hover={{
                                        bg: 'blue.500',
                                    }}>
                                    Add Product
                                </Button>

                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
            </Flex>

        </>)
}
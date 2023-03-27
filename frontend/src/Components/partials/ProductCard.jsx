import {
    Flex,
    Circle,
    Box,
    Image,
    Badge,
    useColorModeValue,
    Icon,
    chakra,
    Tooltip,
} from '@chakra-ui/react';

//   import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
import { FiShoppingCart } from 'react-icons/fi';

const ProductCard = (props) => {
    console.log(props)
    return (
        //   <Flex p={50} w="full" alignItems="center" justifyContent="center">

        <Box
            bg={useColorModeValue('white', 'gray.800')}
            maxW="250px"
            borderWidth="1px"
            rounded="lg"
            shadow="lg"
            position="relative"
            mr={2} my={3}
        >


            <Image
                src={props.imageURL}
                boxSize={"250px"}
                objectFit={"cover"}
                alt={`Picture of ${props.name}`}
                roundedTop="lg"
            />

            <Box p="6">
                {/* <Box d="flex" alignItems="baseline">
                        {props.isNew && (
                            <Badge rounded="full" px="2" fontSize="0.8em" colorScheme="red">
                                New
                            </Badge>
                        )}
                    </Box> */}
                <Flex mt="1" justifyContent="space-between" alignContent="center">
                    <Box
                        fontSize="xl"
                        fontWeight="semibold"
                        as="h4"
                        lineHeight="tight"
                        isTruncated>
                        {props.name}
                    </Box>

                    {/* <Tooltip
                            label="Add to cart"
                            bg="white"
                            placement={'top'}
                            color={'gray.800'}
                            fontSize={'1em'}>
                            <chakra.a href={'#'} display={'flex'}>
                                <Icon as={FiShoppingCart} h={7} w={7} alignSelf={'center'} />
                            </chakra.a>
                        </Tooltip> */}
                </Flex>
                <Box
                    fontSize="md"
                    as='p'
                // isTruncated
                >
                    {props.description.length < 50 ? props.description : props.description.substring(0, 50) + " ..."}
                </Box>
                <Flex justifyContent="space-between" alignContent="center">
                    {/* <Rating rating={props.rating} numReviews={props.numReviews} /> */}
                    <Box fontSize="xl" color={useColorModeValue('gray.800', 'white')}>
                        <Box as="span" color={'gray.600'} fontSize="xl" mr={2}>
                            ₹
                        </Box>
                        {props.price.toFixed(2)}
                    </Box>
                </Flex>
            </Box>
        </Box>
        //   </Flex>
    );
}

export default ProductCard;
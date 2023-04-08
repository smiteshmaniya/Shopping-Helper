import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  Avatar,
  useColorModeValue,
  Image,
  Badge,
  Button,
  Flex,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function ProductWithShops(props) {
  return (
    <Center py={6}>
      <Box
        maxW={"380px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={"2xl"}
        rounded={"md"}
        p={6}
        overflow={"hidden"}
      >
        <Box
          h={"240px"}
          bg={"gray.100"}
          mt={-6}
          mx={-6}
          mb={2}
          pos={"relative"}
        >
          <Image src={props.images} layout={"fill"} w={"full"} h={"inherit"} />
        </Box>
        <Stack>
          <Flex direction={"row"}>
            <Heading
              color={useColorModeValue("gray.700", "white")}
              fontSize={"2xl"}
              fontFamily={"body"}
              letterSpacing={1.1}
              textTransform={"capitalize"}
            >
              {props.product_name}
            </Heading>
            <Text
              color={"#F0A3A3"}
              fontSize={"1xl"}
              fontFamily={"body"}
              textTransform={"capitalize"}
              ml={"auto"}
            >
              {props.userPincode == props.shop_details.pincode
                ? "(Nearby in your Area)"
                : ""}
            </Text>
          </Flex>
          <Text
            color={"white.500"}
            textTransform={"uppercase"}
            fontWeight={800}
            fontSize={"md"}
            letterSpacing={1.1}
          >
            ₹{props.price}
          </Text>
          <Heading
            color={useColorModeValue("gray.700", "white")}
            fontSize={"2xl"}
            fontFamily={"body"}
            textTransform={"capitalize"}
          >
            Shop: {props.shop_details.shop_name}
          </Heading>
          <Text color={"white.500"} fontWeight={400} fontSize={"md"}>
            {props.shop_details.address},{props.shop_details.area},
            {props.shop_details.city},{props.shop_details.pincode}
          </Text>
          <Stack direction={"row"} mt={2}>
            <Badge
              px={2}
              py={1}
              bg={useColorModeValue("gray.50", "gray.800")}
              fontWeight={"400"}
              textTransform={"capitalize"}
            >
              Shop Time:
            </Badge>
            <Badge
              px={2}
              py={1}
              bg={useColorModeValue("gray.50", "gray.800")}
              fontWeight={"400"}
            >
              {props.shop_details.start_time}
            </Badge>
            <Badge
              px={2}
              py={1}
              bg={useColorModeValue("gray.50", "gray.800")}
              fontWeight={"400"}
            >
              -
            </Badge>
            <Badge
              px={2}
              py={1}
              bg={useColorModeValue("gray.50", "gray.800")}
              fontWeight={"400"}
            >
              {props.shop_details.end_time}
            </Badge>
          </Stack>
        </Stack>
        <Stack direction={"row"} spacing={4} justifyContent={"center"} mt={-4}>
          <Link to={`/shopproducts/${props.shop_details._id}`}>
            <Stack
              width={"100%"}
              mt={"2rem"}
              direction={"row"}
              padding={2}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Button
                flex={1}
                fontSize={"sm"}
                rounded={"full"}
                bg={"blue.400"}
                color={"white"}
                boxShadow={
                  "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
                }
                _hover={{
                  bg: "blue.500",
                }}
                _focus={{
                  bg: "blue.500",
                }}
              >
                Explore Shop
              </Button>
            </Stack>
          </Link>
          <Link to={`/product/${props.shop_details._id}/${props.id}`}>
            <Stack
              width={"100%"}
              mt={"2rem"}
              direction={"row"}
              padding={2}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Button
                flex={1}
                fontSize={"sm"}
                rounded={"full"}
                bg={"blue.400"}
                color={"white"}
                boxShadow={
                  "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
                }
                _hover={{
                  bg: "blue.500",
                }}
                _focus={{
                  bg: "blue.500",
                }}
              >
                View Product
              </Button>
            </Stack>
          </Link>
        </Stack>
      </Box>
    </Center>
  );
}

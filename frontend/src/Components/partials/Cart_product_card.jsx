import {
  Badge,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function Cart_product_card(props) {
  return (
    //   <Center py={6}>
    <Stack
      borderWidth="1px"
      borderRadius="lg"
      w={{ sm: "100%", md: "750px" }}
      height={"230px"}
      direction={{ base: "column", md: "row" }}
      bg={useColorModeValue("white", "gray.900")}
      boxShadow={"xl"}
      padding={4}
      mt={3}
    >
      <Flex flex={0.3} bg="blue.200">
        <Image objectFit="cover" boxSize="100%" src={props.imageURL} />
      </Flex>
      <Stack
        flex={0.7}
        flexDirection="column"
        justifyContent="center"
        // alignItems="center"
        p={1}
        pt={2}
      >
        <Link to={props.productLink}>
          <Heading
            fontSize={"2xl"}
            textTransform="capitalize"
            fontFamily={"body"}
            ml={3}
          >
            {props.name}
          </Heading>
          <Text
            //   textAlign={'center'}
            color={useColorModeValue("gray.700", "gray.400")}
            px={3}
          >
            {props.description.length > 120
              ? props.description.substring(0, 120) + "..."
              : props.description}
          </Text>
          <Text fontWeight={600} color={"gray.500"} size="sm" mb={4} px={3}>
            Price: {props.price}
          </Text>
          <Stack direction={"row"} mt={6} px={3}>
            <Text color={useColorModeValue("gray.700", "gray.400")}>
              {" "}
              Quantity :{" "}
            </Text>
            <Badge
              px={2}
              py={1}
              bg={useColorModeValue("gray.50", "gray.800")}
              fontWeight={"400"}
            >
              {props.quantity}
            </Badge>
          </Stack>
        </Link>
        {props.removeItem ? (
          <Stack
            mt={"1rem"}
            direction={"row"}
            padding={2}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Button
              width={"110px"}
              fontSize={"sm"}
              rounded={"full"}
              _focus={{
                bg: "gray.200",
              }}
              onClick={() => {
                props.removeItem(props.product_id);
              }}
            >
              Remove
            </Button>
          </Stack>
        ) : (
          ""
        )}

        {/* <Button
                flex={1}
                fontSize={'sm'}
                rounded={'full'}
                bg={'blue.400'}
                color={'white'}
                boxShadow={
                  '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
                }
                _hover={{
                  bg: 'blue.500',
                }}
                _focus={{
                  bg: 'blue.500',
                }}>
                Follow
              </Button> */}
      </Stack>
    </Stack>
    //   </Center>
  );
}

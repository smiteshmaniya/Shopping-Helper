import {
  Button,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  useBreakpointValue,
  Box,
  SimpleGrid,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";

import { FcDataProtection, FcOvertime, FcShop } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import NearbyShops from "./Customer/NearbyShops";
import { userContext } from "../Routes/MainRoute";
import { useState, useEffect, useContext } from "react";

export default function Home() {
  const navigate = useNavigate();
  const { isuser, setisUser } = useContext(userContext);
  return (
    <>
      {console.log("isuser jj", isuser)}
      <Stack
        minH={"75vh"}
        pt={"5vh"}
        direction={{ base: "column", md: "row" }}
        justifyContent={"space-around"}
      >
        <Flex p={5} align={"center"} justify={"center"}>
          <Stack spacing={6} w={"full"} maxW={"lg"}>
            <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>
              <Text
                as={"span"}
                position={"relative"}
                _after={{
                  content: "''",
                  width: "full",
                  height: useBreakpointValue({ base: "20%", md: "30%" }),
                  position: "absolute",
                  bottom: 1,
                  left: 0,
                  bg: "blue.400",
                  zIndex: -1,
                }}
              >
                Shopping Helper
              </Text>
              <br />{" "}
              <Text color={"blue.400"} as={"span"}>
                Easy shopping
              </Text>{" "}
            </Heading>
            <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.500"}>
              This project is being developed mainly to reduce the efforts and
              save the time of customer rushing to local shops for their daily
              needed products.
            </Text>
            {localStorage.getItem("whoIsLoggedIn") != "shopkeeper" ? (
              <Stack direction={{ base: "column", md: "row" }} spacing={4}>
                <Button
                  rounded={"full"}
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  onClick={() => {
                    navigate("/displayshops");
                  }}
                >
                  Shop Now
                </Button>
                <Button
                  rounded={"full"}
                  onClick={() => {
                    navigate("/cart");
                  }}
                >
                  Go to Cart
                </Button>
              </Stack>
            ) : (
              ""
            )}
          </Stack>
        </Flex>
        <Flex alignItems={"center"} justifyItems={"center"} p={5}>
          <Image
            alt={"Login Image"}
            objectFit={"cover"}
            maxW={"650px"}
            maxH={"400px"}
            w={"100%"}
            h={"100%"}
            borderRadius={"xl"}
            src={`${process.env.PUBLIC_URL}/Images/home1.png`}
            // mr={{base: '32', md: '5'}}
          />
        </Flex>
      </Stack>
      {localStorage.getItem("token") != null &&
      localStorage.getItem("whoIsLoggedIn") != "shopkeeper" ? (
        <NearbyShops />
      ) : (
        ""
      )}

      <Stack align={"center"} p={{ lg: 5, md: 3 }}>
        <FeaturesSection />
      </Stack>
    </>
  );
}

const Feature = ({ title, text, icon }) => {
  return (
    <Stack align={"center"}>
      <Flex
        w={16}
        h={16}
        align={"center"}
        justify={"center"}
        color={"white"}
        rounded={"full"}
        bg={"gray.100"}
        mb={1}
      >
        {icon}
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      <Text color={useColorModeValue("gray.600", "gray.400")}>{text}</Text>
    </Stack>
  );
};

const FeaturesSection = () => {
  return (
    <Box p={4} mb={5}>
      <SimpleGrid
        columns={{ base: 1, md: 3 }}
        spacing={10}
        alignContent={"center"}
        justifyContent={"center"}
      >
        <Feature
          icon={<Icon as={FcOvertime} w={10} h={10} />}
          title={"Order Anytime"}
          text={
            "In this platform customer can order things any time and pick up at their free time in which shops are opened."
          }
        />
        <Feature
          icon={<Icon as={FcShop} w={10} h={10} />}
          title={"Add Shop"}
          text={
            "Local shops can register in this platform and grow their bussiness by getting orders from online customers."
          }
        />
        <Feature
          icon={<Icon as={FcDataProtection} w={10} h={10} />}
          title={"Secure"}
          text={
            "At time of pick of customer can authenticate by 4 digit secure code that is generated when order is successful."
          }
        />
      </SimpleGrid>
    </Box>
  );
};

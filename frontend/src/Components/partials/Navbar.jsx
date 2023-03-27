import { React } from "react";
import {
  Box,
  Flex,
  Avatar,
  // Link,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  Text,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useState, useEffect, useContext } from "react";
import { userContext } from "../../Routes/MainRoute";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { isuser, setisUser } = useContext(userContext);
  const { colorMode, toggleColorMode } = useColorMode();
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [whoIsLoggedin, setWhoIsLoggedIn] = useState("");
  useEffect(() => {
    if (localStorage.getItem("token") != null) {
      setIsLoggedin(true);
    }
    setWhoIsLoggedIn(localStorage.getItem("whoIsLoggedIn"));
  }, []);

  useEffect(() => {
    console.log("isuser ", isuser);
  }, [isuser]);
  const handleLogout = () => {
    setisUser("");
    console.log("logout....");
  };
  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Link to="/">
            <Box>Shopping Helper</Box>
          </Link>

          <Flex alignItems={"center"}>
            <Button onClick={toggleColorMode} mx={3}>
              {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            </Button>
            {console.log("is login", isLoggedin)}
            {isLoggedin ? (
              <Stack direction={"row"} spacing={7}>
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                  >
                    <Avatar
                      size={"sm"}
                      src={`${process.env.PUBLIC_URL}/images/account_logo.png`}
                    />
                  </MenuButton>
                  <MenuList alignItems={"center"} zIndex={3}>
                    <br />
                    <Center>
                      <Avatar
                        size={"2xl"}
                        src={`${process.env.PUBLIC_URL}/images/account_logo.png`}
                      />
                    </Center>
                    <br />
                    <Center>
                      <Text>{localStorage.getItem("name")}</Text>
                    </Center>
                    <br />
                    <MenuDivider />
                    {whoIsLoggedin === "customer" ? (
                      // for customer
                      <>
                        <Link to="/">
                          {" "}
                          <MenuItem>Home</MenuItem>{" "}
                        </Link>
                        <Link to="/displayshops">
                          {" "}
                          <MenuItem>View Shops</MenuItem>{" "}
                        </Link>
                        <Link to="/cart">
                          {" "}
                          <MenuItem>View cart</MenuItem>{" "}
                        </Link>
                        <Link to="/orders">
                          {" "}
                          <MenuItem>Orders History</MenuItem>{" "}
                        </Link>
                        <Link to="/logout">
                          {" "}
                          <MenuItem>Logout</MenuItem>{" "}
                        </Link>
                      </>
                    ) : (
                      // for shopkeeper
                      <>
                        <Link to="/">
                          {" "}
                          <MenuItem>Home</MenuItem>{" "}
                        </Link>
                        <Link to="/addproduct">
                          {" "}
                          <MenuItem>Add Product</MenuItem>{" "}
                        </Link>
                        <Link to="/shopproducts">
                          {" "}
                          <MenuItem> Your Products </MenuItem>{" "}
                        </Link>
                        <Link to="/shoporders">
                          {" "}
                          <MenuItem>View Orders</MenuItem>{" "}
                        </Link>
                        <Link to="/logout">
                          {" "}
                          <MenuItem>Logout</MenuItem>{" "}
                        </Link>
                      </>
                    )}
                  </MenuList>
                </Menu>
              </Stack>
            ) : (
              <Stack
                flex={{ base: 1, md: 0 }}
                justify={"flex-end"}
                direction={"row"}
                spacing={6}
              >
                {isuser == "" ? (
                  <>
                    <Button
                      as={"a"}
                      fontSize={"sm"}
                      fontWeight={400}
                      variant={"link"}
                      href={"/login"}
                    >
                      Sign In
                    </Button>
                    <Button
                      as={"a"}
                      display={{ base: "none", md: "inline-flex" }}
                      fontSize={"sm"}
                      fontWeight={600}
                      color={"white"}
                      bg={"pink.400"}
                      href={"/signup"}
                      _hover={{
                        bg: "pink.300",
                      }}
                    >
                      Sign Up
                    </Button>
                  </>
                ) : (
                  <Button
                    as={"a"}
                    display={{ base: "none", md: "inline-flex" }}
                    fontSize={"sm"}
                    fontWeight={600}
                    color={"white"}
                    bg={"pink.400"}
                    onClick={handleLogout}
                    _hover={{
                      bg: "pink.300",
                    }}
                  >
                    Logout
                  </Button>
                )}
              </Stack>
            )}
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

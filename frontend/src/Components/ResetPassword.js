import React, { useState } from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  RadioGroup,
  Radio,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { API } from "./API/api_url";
import { useNavigate, useParams } from "react-router-dom";
import showToast from "./partials/showToast.js";
export default function ResetPassword() {
  const { who, token } = useParams();
  const [password, setPassword] = useState("");
  const [Cpassword, setCPassword] = useState("");
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    console.log("in.......");
    if (password !== Cpassword) {
      alert("Password not matched...");
      document.getElementsByName("password")[0].focus();
    } else {
      let strongPassword = new RegExp(
        "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
      );

      if (!strongPassword.test(password)) {
        return showToast(toast, {
          title: "Signup Unsuccessfull",
          description: "Please Enter Strong Password!",
          status: "error",
        });
      }
      const data = await axios.post(`${API}/api/${who}/forgot/verifypassword`, {
        token,
        password,
      });
      if (data.status == 200) {
        showToast(toast, {
          title: "Success!!!",
          description: "Password changed successfully.",
          status: "success",
        });
        navigate("/login");
      } else {
        showToast(toast, {
          title: "OOPS!!!Failed.",
          description: data.data.message, //"Something went wrong with password changing process.",
          status: "error",
        });
      }
      console.log("------", data);
    }
  };

  return (
    <Flex
      minH={"90vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6} w={"400px"}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Reset Your Password
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>

            <FormControl id="email" isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                name="Cpassword"
                value={Cpassword}
                onChange={(e) => setCPassword(e.target.value)}
              />
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={"blue.400"}
                color={"white"}
                onClick={onSubmit}
                _hover={{
                  bg: "blue.500",
                }}
                isLoading={isBtnLoading ? true : false}
                spinnerPlacement="end"
              >
                Submit
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

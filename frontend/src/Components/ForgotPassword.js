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
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { API } from "./API/api_url";
import showToast from "./partials/showToast";

export default function ForgotPassword() {
  const toast = useToast();
  const { who } = useParams();
  const [email, setEmail] = useState("");
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  let data = null;
  const onSubmit = async (e) => {
    data = await axios.post(`${API}/api/${who}/forgot`, {
      email: email,
    });
    console.log("------", data);
    // console.log("------");

    if (data != null && data.status == 200) {
      showToast(toast, {
        title: "Mail sent successfully",
        description: "Change password link is sent to the email.",
        status: "info",
      });
    } else {
      console.log("Failing");
      showToast(toast, {
        title: "OOPS!!!Failed.",
        description: "Please Enter Valid Email.",
        status: "error",
      });
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
            Forgot Password
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
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

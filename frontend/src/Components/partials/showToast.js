const showToast = (toast, details) => {
  toast({
    ...details,
    duration: 3000,
    isClosable: true,
    position: "bottom-right",
    variant:
      localStorage.getItem("chakra-ui-color-mode") === "light"
        ? "subtle"
        : "solid",
  });
};
export default showToast;

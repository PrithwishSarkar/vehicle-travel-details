import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Button,
  VStack,
  HStack,
  Image,
  Icon,
  Flex,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useBreakpointValue,
} from "@chakra-ui/react";
import { MdOutlineFileUpload } from "react-icons/md";
import TableComponent from "./TableComponent";
import NavBar from "./NavBar";

const UploadPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tripName, setTripName] = useState("");
  const [file, setFile] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [data, setData] = useState([]);
  const API_URL = process.env.REACT_APP_SERVER_URL;
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    const savedData = sessionStorage.getItem("uploadedData");
    const uploadedStatus = sessionStorage.getItem("isUploaded");

    if (savedData) {
      setData(JSON.parse(savedData));
      setIsUploaded(uploadedStatus === "true");
    }
  }, []);

  const handleFileChange = async (e) => {
    e.preventDefault();
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }

    setFile(selectedFile);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(`${API_URL}/${tripName}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      const result = await response.json();
      setData(result);

      sessionStorage.setItem("uploadedData", JSON.stringify(result));
      sessionStorage.setItem("isUploaded", "true");

      setIsUploaded(true);
      setFile(null);
      setTripName("");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleUpdate = (newData) => {
    sessionStorage.setItem("uploadedData", JSON.stringify(newData));
    setData(newData);
    if (!newData.length) {
      sessionStorage.setItem("isUploaded", "false");
      setIsUploaded(false);
    }
  };

  return (
    <Box h="100vh">
      <NavBar />
      <VStack p={4} spacing={4} textAlign="center">
        <Flex
          border="2px solid gray"
          borderRadius="10px"
          width="80vw"
          height="50px"
          alignItems="center"
          paddingLeft="10px"
        >
          <Text fontSize="1.4rem" fontWeight="bold">
            👋 Welcome, User
          </Text>
        </Flex>

        {isUploaded && (
          <HStack
            border="2px solid gray"
            borderRadius="10px"
            width="80vw"
            p="0 20px"
            h="70px"
          >
            <Button
              bg="gray.800"
              color="white"
              variant="solid"
              _hover={{ bg: "gray.700" }}
              m="10px 0"
              onClick={onOpen}
            >
              Upload Trip
            </Button>

            <Text fontSize={isMobile ? "sm" : "md"} color="gray.600">
              Upload the <u>Excel</u> sheet of your trip
            </Text>
          </HStack>
        )}

        {!isUploaded && (
          <VStack
            border="2px solid gray"
            borderRadius="10px"
            width="80vw"
            height="400px"
            alignItems="center"
            p="50px 5px 30px 5px"
          >
            <Image src="images/cuate.png" boxSize="200px" mb="20px" />

            <Button
              bg="gray.800"
              color="white"
              variant="solid"
              _hover={{ bg: "gray.700" }}
              m="10px 0"
              onClick={onOpen}
            >
              Upload Trip
            </Button>

            <Text fontSize="md" color="gray.600">
              Upload the <u>Excel</u> sheet of your trip
            </Text>
          </VStack>
        )}

        {isUploaded && (
          <TableComponent data={data || []} updateData={handleUpdate} />
        )}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Trip Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="Trip Name*"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                isRequired
              />

              <Button
                as="label"
                htmlFor="file-upload"
                width="full"
                height="100px"
                border="1px solid"
                borderColor="blue.400"
                color="blue.400"
                bg="white"
                py={8}
                textAlign="center"
                cursor="pointer"
              >
                <VStack spacing={2}>
                  <Icon as={MdOutlineFileUpload} w={8} h={8} />
                  <Text>
                    {file
                      ? file.name
                      : "Click here to upload the Excel sheet of your trip"}
                  </Text>
                </VStack>
              </Button>
              <Input
                id="file-upload"
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                display="none"
              />
            </VStack>
          </ModalBody>

          <ModalFooter display="flex" justifyContent="center" mb="10px">
            <Button
              variant="outline"
              border="1px solid black"
              onClick={onClose}
              width="50%"
              mr="5%"
            >
              Cancel
            </Button>
            <Button
              bg="gray.800"
              color="white"
              variant="solid"
              _hover={{ bg: "gray.700" }}
              width="50%"
              ml="5%"
              onClick={onClose}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default UploadPage;

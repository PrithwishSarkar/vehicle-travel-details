import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Checkbox,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  HStack,
  VStack,
  Text,
  IconButton,
  Flex,
  useBreakpointValue,
} from "@chakra-ui/react";
import { RiDeleteBinLine } from "react-icons/ri";
import { RiArrowRightWideFill } from "react-icons/ri";
import Pagination from "./Pagination";

export default function TableComponent({ data, updateData }) {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_SERVER_URL;
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const entriesPerPage = isMobile ? 6 : 8;
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentTrips = (Array.isArray(data) ? data : []).slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const handleCheckboxChange = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
      setSelectAllChecked(false);
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectAllChecked) {
      setSelectedIds([]);
    } else {
      const allIds = data.map((trip) => trip.trip_id);
      setSelectedIds(allIds);
    }
    setSelectAllChecked(!selectAllChecked);
  };

  const handleDelete = async (singleID) => {
    try {
      const idsString = singleID.length ? singleID : selectedIds.join(",");
      const response = await fetch(`${API_URL}?id=${idsString}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (result.length === 0) {
        setSelectAllChecked(false);
      }
      updateData(result || []);
      console.log(result);
    } catch (error) {
      console.error("Error deleting trips:", error);
    }
  };

  const handleOpen = async (singleID) => {
    try {
      const idsString = singleID.length ? singleID : selectedIds.join(",");
      const response = await fetch(`${API_URL}?id=${idsString}`, {
        method: "GET",
      });

      const tripDetailsArray = await response.json();
      navigate("/dashboard", { state: { tripDetailsArray } });
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  return (
    <Box id="trip_details" w="80vw" p="2px" textAlign="left" height="60vh">
      <HStack justifyContent="space-between">
        <Text fontSize="2xl" fontWeight="bold">
          Your Trips
        </Text>
        {!isMobile && (
          <HStack>
            <Button
              variant="outline"
              border="1px solid gray"
              width="50%"
              color="gray.400"
              onClick={() => handleDelete(selectedIds)}
            >
              Delete
            </Button>
            <Button
              bg="gray.500"
              color="white"
              variant="solid"
              _hover={{ bg: "gray.400" }}
              width="50%"
              onClick={() => handleOpen(selectedIds)}
            >
              Open
            </Button>
          </HStack>
        )}
      </HStack>
      <VStack>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th px={isMobile ? "10px" : "0"} py={2}>
                <Flex>
                  {!isMobile && (
                    <Checkbox
                      isChecked={selectAllChecked}
                      onChange={handleSelectAll}
                      mr={4}
                    />
                  )}
                  <Text>Trips</Text>
                </Flex>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentTrips.map((trip) => (
              <Tr key={trip.trip_id}>
                <Td py={isMobile ? "0px" : "8px"} px={isMobile ? "10px" : "0"}>
                  <Flex
                    justifyContent={isMobile ? "space-between" : "flex-start"}
                    alignItems="center"
                    w="100%"
                  >
                    {!isMobile && (
                      <Checkbox
                        isChecked={selectedIds.includes(trip.trip_id)}
                        onChange={() => handleCheckboxChange(trip.trip_id)}
                        mr={4}
                      />
                    )}
                    <Text textAlign="left" sx={{ whiteSpace: "nowrap" }}>
                      {`${trip.source} - ${trip.destination}`}
                    </Text>
                    {isMobile && (
                      <HStack spacing={2} ml="auto">
                        <IconButton
                          p={0}
                          variant="ghost"
                          icon={<RiDeleteBinLine />}
                          onClick={() => handleDelete([trip.trip_id])}
                        />
                        <IconButton
                          p={0}
                          variant="ghost"
                          icon={<RiArrowRightWideFill />}
                          onClick={() => handleOpen([trip.trip_id])}
                        />
                      </HStack>
                    )}
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <Box position="fixed" bottom="30px">
          <Pagination
            rowsPerPage={entriesPerPage}
            totalRows={data.length}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </Box>
      </VStack>
    </Box>
  );
}

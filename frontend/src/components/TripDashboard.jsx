import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Tabs,
  Tab,
  TabList,
  Button,
  HStack,
  VStack,
  Text,
  IconButton,
  Flex,
  useBreakpointValue,
} from "@chakra-ui/react";
import { MdArrowForwardIos } from "react-icons/md";
import { MdArrowBackIosNew } from "react-icons/md";
import MapView from "./MapView";
import TripDetailsTable, { formatTime } from "./TripDetailsTable";
import Pagination from "./Pagination";
import { RiPinDistanceFill } from "react-icons/ri";
import { FaClock } from "react-icons/fa6";
import { IoArrowBackOutline } from "react-icons/io5";
import DeatilBox from "./DetailBox";
import NavBar from "./NavBar";

const TripDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tripDetailsArray } = location.state;
  const [selectedTab, setSelectedTab] = useState(0);

  const tabNumber = useBreakpointValue({
    base: 2,
    sm: 5,
    md: 8,
    lg: 10,
  });

  const [visibleTabs, setVisibleTabs] = useState(tabNumber || 5);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(3);
  const [openTrip, setOpenTrip] = useState(tripDetailsArray[0]);

  const handleTabChange = (index) => {
    setSelectedTab(index);
    setOpenTrip(tripDetailsArray[index]);
  };
  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    setVisibleTabs(tabNumber || 5);
  }, [tabNumber]);

  const handleNext = () => {
    const maxTabs = tripDetailsArray.length;
    const nextVisibleTabs = visibleTabs + tabNumber;

    if (nextVisibleTabs <= maxTabs) {
      setVisibleTabs(nextVisibleTabs);
    } else {
      setVisibleTabs(maxTabs);
    }
  };

  const handlePrev = () => {
    const prevVisibleTabs = visibleTabs - tabNumber;

    if (prevVisibleTabs >= tabNumber) {
      setVisibleTabs(prevVisibleTabs);
    } else {
      setVisibleTabs(tabNumber);
    }
  };

  const { path } = openTrip;

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = path.slice(indexOfFirstRow, indexOfLastRow);

  if (!tripDetailsArray) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
      <NavBar />
      <Box width="80vw" margin="auto">
        <VStack mb="30px">
          <Box width="100%" textAlign="left" m="10px 0 10px 10px">
            <IoArrowBackOutline size={35} onClick={handleGoBack} />
          </Box>

          <HStack
            border="2px solid gray"
            borderRadius="10px"
            width="80vw"
            p="0 20px"
            h="60px"
            justifyContent="space-between"
          >
            <Text fontSize="1.4rem" fontWeight="bold">
              {openTrip.trip_name}
            </Text>
            <Button
              bg="gray.800"
              color="white"
              variant="solid"
              _hover={{ bg: "gray.700" }}
              m="10px 0"
            >
              New
            </Button>
          </HStack>

          <Box w="100%">
            <MapView tripData={openTrip} />
          </Box>

          <Box
            display="flex"
            alignItems="center"
            mb={4}
            width="100%"
            justifyContent="space-between"
          >
            <Flex>
              <IconButton
                variant="ghost"
                onClick={handlePrev}
                icon={<MdArrowBackIosNew />}
                isDisabled={visibleTabs <= tabNumber}
                border="1px solid gray"
              />
              <Tabs index={selectedTab} onChange={handleTabChange}>
                <TabList>
                  {tripDetailsArray
                    .slice(visibleTabs - tabNumber, visibleTabs)
                    .map((trip, index) => (
                      <Tab key={index}>{trip.trip_name}</Tab>
                    ))}
                </TabList>
              </Tabs>
            </Flex>

            <IconButton
              variant="ghost"
              onClick={handleNext}
              icon={<MdArrowForwardIos />}
              isDisabled={visibleTabs >= tripDetailsArray.length}
              border="1px solid gray"
            />
          </Box>

          <Box display="flex" justifyContent="space-around" mb={4}>
            <DeatilBox
              icon={<RiPinDistanceFill color="dodgerblue" />}
              value={openTrip.total_distance_travelled.toFixed(2) + " KM"}
              text={"Total Distance Travelled"}
            ></DeatilBox>

            <DeatilBox
              icon={<FaClock color="dodgerblue" />}
              value={formatTime(openTrip.total_travel_duration.toFixed(2))}
              text={"Total Travelled Duration"}
            ></DeatilBox>

            <DeatilBox
              icon={<FaClock color="cyan" />}
              value={formatTime(openTrip.overspeeding_duration.toFixed(2))}
              text={"Over Speeding Duration"}
            ></DeatilBox>

            <DeatilBox
              icon={<RiPinDistanceFill color="cyan" />}
              value={openTrip.overspeeding_distance.toFixed(2) + " KM"}
              text={"Over Speeding Distance"}
            ></DeatilBox>

            <DeatilBox
              icon={<FaClock color="blue" />}
              value={formatTime(openTrip.total_stopped_duration.toFixed(2))}
              text={"Stopped Duration"}
            ></DeatilBox>
          </Box>

          <TripDetailsTable currentRows={currentRows} />

          <Pagination
            rowsPerPage={rowsPerPage}
            totalRows={path.length}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </VStack>
      </Box>
    </Box>
  );
};

export default TripDashboard;

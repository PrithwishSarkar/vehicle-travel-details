import React from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  CircleMarker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Box, Text, Flex, VStack } from "@chakra-ui/react";

const StartIcon = new L.Icon({
  iconUrl:
    "https://png.pngtree.com/png-clipart/20230123/original/pngtree-flat-red-location-sign-png-image_8927579.png",
  iconSize: [30, 30],
});

const EndIcon = new L.Icon({
  iconUrl:
    "https://png.pngtree.com/png-clipart/20230123/original/pngtree-flat-red-location-sign-png-image_8927579.png",
  iconSize: [30, 30],
});

const MapView = ({ tripData }) => {
  const defaultCenter = [tripData.source.latitude, tripData.source.longitude];
  const defaultZoom = 14;

  const pathCoordinates = tripData.path.map(
    ({ start, end, isOverspeeding }) => ({
      positions: [
        [start.latitude, start.longitude],
        [end.latitude, end.longitude],
      ],
      isOverspeeding: isOverspeeding,
    })
  );

  return (
    <VStack width="100%" padding="2">
      <Flex marginBottom="10px" justifyContent="flex-start">
        <Text color="navy" fontWeight="bold">
          ●
        </Text>
        <Text marginLeft="4px" marginRight="8px">
          Stopped
        </Text>

        <Text color="pink" fontWeight="bold">
          ●
        </Text>
        <Text marginLeft="4px" marginRight="8px">
          Idle
        </Text>

        <Text color="cyan" fontWeight="bold">
          ●
        </Text>
        <Text marginLeft="4px" marginRight="8px">
          Overspeeding
        </Text>
      </Flex>

      <Box height="500px" width="100%" borderRadius="md" overflow="hidden">
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />

          {pathCoordinates.map((segment, index) => (
            <Polyline
              key={index}
              positions={segment.positions}
              color={segment.isOverspeeding ? "cyan" : "blue"}
            />
          ))}

          {tripData.stoppage_points.map((point, index) => (
            <CircleMarker
              key={index}
              center={[point.latitude, point.longitude]}
              radius={8}
              color="navy"
            >
              <Popup>Stopped for {point.stoppageDuration} minutes</Popup>
            </CircleMarker>
          ))}

          {tripData.idling_points.map((point, index) => (
            <CircleMarker
              key={index}
              center={[point.latitude, point.longitude]}
              radius={8}
              color="pink"
            >
              <Popup>Idling for {point.idlingDuration} minutes</Popup>
            </CircleMarker>
          ))}

          <Marker
            position={[tripData.source.latitude, tripData.source.longitude]}
            icon={StartIcon}
          >
            <Popup>Start Point</Popup>
          </Marker>

          <Marker
            position={[
              tripData.destination.latitude,
              tripData.destination.longitude,
            ]}
            icon={EndIcon}
          >
            <Popup>End Point</Popup>
          </Marker>
        </MapContainer>
      </Box>
    </VStack>
  );
};

export default MapView;

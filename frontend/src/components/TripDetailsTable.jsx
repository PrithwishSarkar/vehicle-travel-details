import React from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

export const formatTime = (mins) => {
  let hr = Math.floor(mins / 60);
  if (hr) return `${Math.floor(mins / 60)} Hr ${mins % 60} mins`;
  else return `${mins % 60} Mins`;
};

const formatDate = (dateISO) => {
  return new Date(dateISO).toLocaleTimeString();
};

const formatCoordinate = (lat, lon) => {
  let coord = `${Math.abs(lat).toFixed(4)}`;
  coord += lat >= 0 ? "° N, " : "° S, ";
  coord += `${Math.abs(lon).toFixed(4)}`;
  coord += lon >= 0 ? "° E" : "° W";
  return coord;
};

const formatDeatils = (currentRows) => {
  let sumTime = 0;
  let sumDist = 0;
  let stopTime = 0;
  let overSpeed = 0;

  for (let i = 0; i < 3; i++) {
    if (currentRows[i]) {
      sumTime += currentRows[i].duration;
      sumDist += currentRows[i].distance;
      overSpeed += currentRows[i].speed > 60 ? currentRows[i].duration : 0;
      stopTime +=
        currentRows[i].end.ignition === "off" ? currentRows[i].duration : 0;
    }
  }

  let str = `Travel Duration: ${formatTime(
    sumTime.toFixed(2)
  )}\n\nStopped for: ${formatTime(
    stopTime.toFixed(2)
  )}\n\nDistance: ${sumDist.toFixed(
    2
  )}KM\n\nOverspeeding Duration: ${formatTime(overSpeed.toFixed(2))}`;

  return str.split("\n").map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));
};

const TripDetailsTable = ({ currentRows }) => {
  return (
    <Table
      variant="simple"
      mb={4}
      border="1px solid gray"
      borderCollapse="collapse"
    >
      <Thead>
        <Tr>
          <Th border="1px solid gray">Time</Th>
          <Th border="1px solid gray">Point</Th>
          <Th border="1px solid gray">Ignition</Th>
          <Th border="1px solid gray">Speed</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td border="1px solid gray">
            {formatDate(currentRows[0].start.timestamp)} to{" "}
            {formatDate(currentRows[0].start.timestamp)}
          </Td>
          <Td border="1px solid gray">
            {formatCoordinate(
              currentRows[0].end.latitude,
              currentRows[0].end.longitude
            )}
          </Td>
          {currentRows[0].end.ignition === "on" ? (
            <Td color="green" border="1px solid gray">
              ON
            </Td>
          ) : (
            <Td color="red" border="1px solid gray">
              OFF
            </Td>
          )}
          <Td border="1px solid gray">{currentRows[0].speed} KM/H</Td>
          <Td rowSpan={3} border="1px solid gray">
            {formatDeatils(currentRows)}
          </Td>
        </Tr>
        <Tr>
          <Td border="1px solid gray">
            {formatDate(currentRows[1].start.timestamp)} to{" "}
            {formatDate(currentRows[1].start.timestamp)}
          </Td>
          <Td border="1px solid gray">
            {formatCoordinate(
              currentRows[1].end.latitude,
              currentRows[1].end.longitude
            )}
          </Td>
          {currentRows[1].end.ignition === "on" ? (
            <Td color="green" border="1px solid gray">
              ON
            </Td>
          ) : (
            <Td color="red" border="1px solid gray">
              OFF
            </Td>
          )}
          <Td border="1px solid gray">{currentRows[1].speed} KM/H</Td>
        </Tr>
        <Tr>
          <Td border="1px solid gray">
            {formatDate(currentRows[2].start.timestamp)} to{" "}
            {formatDate(currentRows[2].start.timestamp)}
          </Td>
          <Td border="1px solid gray">
            {formatCoordinate(
              currentRows[2].end.latitude,
              currentRows[2].end.longitude
            )}
          </Td>
          {currentRows[2].end.ignition === "on" ? (
            <Td color="green" border="1px solid gray">
              ON
            </Td>
          ) : (
            <Td color="red" border="1px solid gray">
              OFF
            </Td>
          )}
          <Td border="1px solid gray">{currentRows[2].speed} KM/H</Td>
        </Tr>
      </Tbody>
    </Table>
  );
};

export default TripDetailsTable;

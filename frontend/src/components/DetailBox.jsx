import { Box, Text } from "@chakra-ui/react";
export default function DeatilBox({ icon, value, text }) {
  return (
    <Box
      textAlign="center"
      border="2px solid gray"
      m="5px 10px"
      p={2}
      w="200px"
      borderRadius="5px"
    >
      {icon}
      <Text fontWeight="bold" fontSize="1.1rem">
        {value}
      </Text>
      <Text>{text}</Text>
    </Box>
  );
}

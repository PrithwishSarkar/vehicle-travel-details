import { Heading, Flex, HStack, Image } from "@chakra-ui/react";

export default function NavBar() {
  return (
    <Flex
      justify="space-between"
      align="center"
      width="vw"
      height="9vh"
      paddingLeft="20px"
      mb="10px"
      boxShadow="lg"
    >
      <HStack spacing={2}>
        <Image
          src="https://images.freeimages.com/fic/images/icons/2770/ios_7_icons/512/speedometer.png"
          boxSize="40px"
          alt="Speedo Logo"
        />

        <Heading fontSize="1.5rem" color="gray.700">
          Speedo
        </Heading>
      </HStack>
    </Flex>
  );
}

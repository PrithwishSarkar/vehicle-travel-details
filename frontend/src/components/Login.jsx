import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Input,
  Image,
  Text,
  Button,
  FormControl,
  FormLabel,
  Heading,
  VStack,
} from "@chakra-ui/react";

const Login = ({ handleLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onLogin = () => {
    if (handleLogin(email, password)) {
      navigate("/upload");
    } else {
      alert("Email/Password mismatch. Enter again.");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <Box
      bgGradient="linear(to-b, green.200, blue.200)"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        bg="white"
        p={12}
        rounded="xl"
        boxShadow="md"
        width={{ base: "90%", md: "400px" }}
      >
        <VStack spacing={4} align="center">
          <Heading size="lg" mb={6}>
            <Box as="span" display="inline-block" mr={2}>
              <Image
                src="https://images.freeimages.com/fic/images/icons/2770/ios_7_icons/512/speedometer.png"
                boxSize="40px"
                alt="Speedo Logo"
              />
            </Box>
            <Text fontSize="1.5rem" color="gray.700" display="inline">
              Speedo
            </Text>
          </Heading>

          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Example@email.com"
              isRequired
              focusBorderColor="blue.500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="At least 8 characters"
              isRequired
              focusBorderColor="blue.500"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </FormControl>

          <Button
            backgroundColor="gray.800"
            color="white"
            size="md"
            width="full"
            onClick={onLogin}
          >
            Sign in
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default Login;

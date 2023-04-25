import { useState } from "react";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Image, useToast,
} from "@chakra-ui/react";
import {useRouter} from "next/router";
import { auth, database} from "../../lib/firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc , getDoc, collection } from 'firebase/firestore'
import Navbar from "@/components/Navbar";


function LoginPage() {
  const toast = useToast();
  const router = useRouter() ;
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedOption, setSelectedOption] = useState("admin");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleLoginFormSubmit = async (event) => {
    event.preventDefault();
    try {
      if (selectedOption === "admin") {
        // Sign in as admin
        const userCredential = await  signInWithEmailAndPassword( auth , email, password);
        const user = userCredential.user;
        const userRef = doc(collection(database, "users"), user.uid);
        const snapshot = await getDoc(userRef);
        if (snapshot.exists() && snapshot.data().role !== "admin") {
          setError("You are not authorized to access this app.");
          await auth.signOut();
        } else {
          await router.push("/AdminHome");
        }
      } else if (selectedOption === "volunteer") {
        await router.push("/Volunteer");
        toast({
          title: "Successfully Signed In",
          description: `You have successfully signed in as as '${selectedOption}' `,
          status: "success",
          duration: 5000,
          isClosable: true,
        });

      } else if (selectedOption === "donor") {
        await router.push("/Donor");
        toast({
          title: "Successfully Signed In",
          description: `You have successfully signed in as as '${selectedOption}' `,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Invalid login option",
          description: `The selected option '${selectedOption}' is not valid.`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      setError(error.message);
    }
  };




  return (
      <Box w={'100%'}>
        <Navbar />
        <Box p={8}  bgImage="url(https://duolearn-public.s3.ap-south-1.amazonaws.com/pexels-julia-m-cameron-6994982.jpg)"
             bgSize="cover"
             bgPosition="center"
             minH="95vh"  >
          <Center pt={'60%'}>

            <Box w="400px">

              {/*<Image src="/logo.png" alt="Logo" align="center" mb={4} />*/}
              <form onSubmit={handleLoginFormSubmit}>
                <FormControl mb={4}>
                  <FormLabel color={'white'} htmlFor="login-option">Login as:</FormLabel>
                  <Select
                      id="login-option"
                      value={selectedOption}
                      onChange={handleOptionChange}
                  >
                    <option color={'black'} value="admin">Admin</option>
                    <option color={'black'}   value="volunteer">Volunteer</option>
                    <option color={'black'}  value="donor">Donor</option>
                  </Select>
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel color={'white'} htmlFor="email">Email address</FormLabel>
                  <Input   color={'white'} type="email" id="email"    value={email}
                         onChange={(e) => setEmail(e.target.value)} />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel color={'white'} htmlFor="password">Password</FormLabel>
                  <Input color={'white'} type="password" id="password"   value={password}
                         onChange={(e) => setPassword(e.target.value)} />
                </FormControl>
                <Button size={'lg'} ml={"35%"} type="submit" color={'blue.500'}  onClick={handleLoginFormSubmit}>Login</Button>

              </form>
            </Box>
          </Center>
        </Box>
      </Box>

  );
}

export default LoginPage;

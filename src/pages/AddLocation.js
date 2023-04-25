import { useState } from "react";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    useToast,
} from "@chakra-ui/react";
import { collection, addDoc } from "firebase/firestore";
import { database } from "../../lib/firebase";
import Navbar from "@/components/Navbar";
import {useRouter} from "next/router";

const AddLocation = () => {
    const [locationName, setLocationName] = useState("");
    const [locationAddress, setLocationAddress] = useState("");
    const [locationContact, setLocationContact] = useState("");
    const toast = useToast();
    const router = useRouter() ;
    const handleAddLocation = async () => {
        try {
            const docRef = await addDoc(collection(database, "locations"), {
                name: locationName,
                address: locationAddress,
                contact: locationContact,
            });
            console.log("Location added with ID: ", docRef.id);

            // Show a success toast
            toast({
                title: "Location added.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            // Reset the input fields
            setLocationName("");
            setLocationAddress("");
            setLocationContact("");
            await router.push("/Locations")
        } catch (error) {
            console.error("Error adding location: ", error);

            // Show an error toast
            toast({
                title: "Error adding location.",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Box w={"100%"}>
            <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="rgba(0,0,0,0.5)"
            />
            <Navbar />
            <Box bgImage="url(https://duolearn-public.s3.ap-south-1.amazonaws.com/pexels-julia-m-cameron-6995301.jpg)"
                bgSize="cover"
                bgPosition="center"
                minH="100vh" maxW={"container.lg"} mx={"auto"} py={8}  h={'50%'}>
                <Box  p={8} rounded={"lg"} mt={'20%'} >
                    <FormControl id="locationName" mb={4}>
                        <FormLabel color={'white'}>Location Name</FormLabel>
                        <Input
                            color={'white'}
                            type="text"
                            value={locationName}
                            onChange={(e) => setLocationName(e.target.value)}
                        />
                    </FormControl>
                    <FormControl id="locationAddress" mb={4}>
                        <FormLabel color={'white'}>Location Address</FormLabel>
                        <Textarea
                            color={'white'}
                            value={locationAddress}
                            onChange={(e) => setLocationAddress(e.target.value)}
                        />
                    </FormControl>
                    <FormControl id="locationContact" mb={4}>
                        <FormLabel color={'white'}>Location Contact Information</FormLabel>
                        <Input
                            color={'white'}
                            type="text"
                            value={locationContact}
                            onChange={(e) => setLocationContact(e.target.value)}
                        />
                    </FormControl>
                    <Button colorScheme="blue" onClick={handleAddLocation}>
                        Add Location
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default AddLocation;

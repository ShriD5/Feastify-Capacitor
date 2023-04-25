import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import {
    Box,
    SimpleGrid,
    Text,
    Heading,
    Center,
    Spinner, Container, Stack, Button, useDisclosure,
} from "@chakra-ui/react";
import {database} from "../../lib/firebase";
import Navbar from "@/components/Navbar";
import {AddIcon} from "@chakra-ui/icons";
import {useRouter} from "next/router";

function VolunteerLocations() {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
     useEffect(() => {
        const fetchLocations = async () => {
            const locationsRef = collection(database, "locations");
            const locationsSnapshot = await getDocs(locationsRef);
            const locationsList = locationsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setLocations(locationsList);
            setLoading(false);
        };
        fetchLocations();
    }, []);

    return (
        <Box
            bgImage="url(https://duolearn-public.s3.ap-south-1.amazonaws.com/pexels-julia-m-cameron-6994963.jpg)"
            bgSize="cover"
            bgPosition="center"
            minH="100vh"
            opacity={'unset'}
        >

            <Navbar />
            <Container maxW={"container.lg"}>
                <Center h="full">
                    <Box p={5}>
                        <Heading as="h1" size="lg" mb={5} fontWeight={'bold'}>
                            LOCATION DETAILS FOR PEOPLE IN NEED
                        </Heading>
                        {loading ? (
                            <Center>
                                <Spinner size="lg" />
                            </Center>
                        ) : (
                            <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={10}>
                                {locations.map((location) => (
                                    <Box
                                        key={location.id}
                                        bg="white"
                                        boxShadow="md"
                                        borderRadius="lg"
                                        overflow="hidden"
                                    >
                                        <Box p={4}>
                                            <Heading as="h2" size="lg" mb={2}>
                                    <span style={{color:"blue"}}>  Location:    </span>       {location.name}
                                            </Heading>
                                            <Text fontSize="lg" mb={3}>
                                                <span style={{color:"blue"}}>  Full Address:    </span>     {location.address}
                                            </Text>
                                            <Text fontSize="md"> <span style={{color:"blue"}}>  Location Contact:    </span>   {location.contact}</Text>
                                        </Box>    <Button
                                        bg="blue.500"
                                        color="white"
                                        size="lg"
                                        w="60px"
                                        h="60px"
                                        boxShadow="md"
                                        position={"fixed"}
                                        bottom={4}
                                        right={4}
                                        borderRadius={'full'}
                                        onClick={() => router.push("/AddLocation")}
                                    >
                                        <AddIcon />
                                    </Button>
                                    </Box>
                                ))}
                            </SimpleGrid>
                        )}
                    </Box>
                </Center>
            </Container>
        </Box>
    );
}

export default VolunteerLocations;

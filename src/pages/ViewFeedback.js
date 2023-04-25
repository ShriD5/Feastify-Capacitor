import { useState, useEffect } from "react";
import {
    Box,
    Center,
    Heading,
    SimpleGrid,
    Text,
    useToast
} from "@chakra-ui/react";
import Navbar from "@/components/Navbar";
import { collection, getDocs } from "firebase/firestore";
import { database } from "@/../lib/firebase";
import BackButton from "@/components/IconButton";

function AdminFeedback() {
    const [feedbackData, setFeedbackData] = useState([]);
    const toast = useToast();

    useEffect(() => {
        const fetchFeedbackData = async () => {
            const feedbackCollection = collection(database, "feedback");
            const feedbackSnapshot = await getDocs(feedbackCollection);
            const feedbackData = feedbackSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setFeedbackData(feedbackData);
        };
        fetchFeedbackData();
    }, []);


    return (
        <Box
            w={"100%"}
            bgImage="url(https://duolearn-public.s3.ap-south-1.amazonaws.com/pexels-julia-m-cameron-6994963.jpg)"
            bgSize="cover"
            bgPosition="center"
            minH="100vh"
        >
            <Navbar />
            <Box p={8}>
                <Center>
                    <Box d={{ base: "block", md: "none" }}>
                        <BackButton route="/" />
                    </Box>
                    <Box w="full" maxW="container.xl">
                        <Heading color={'white'} as="h1" size="xl"  mb={5}>
Volunteer Feedback
                        </Heading>
                        <SimpleGrid columns={[1, 2, 3]} spacing={8}>
                            {feedbackData.map((feedback) => (
                                <Box
                                    key={feedback.id}
                                    bg="white"
                                    p={8}
                                    rounded="lg"
                                    boxShadow="lg"
                                    color="black"
                                >
                                    <Heading as="h2" size="lg" mb={4}>
                                        Donor Name: {feedback.donorName}
                                    </Heading>
                                    <Text mb={4}> <span style={{color:"blue"}}>Food Quality:</span> {feedback.foodQuality}</Text>
                                    <Text mb={4}><span style={{color:"blue"}} >Food Quantity: </span>{feedback.foodQuantity}</Text>
                                    <Text mb={4}><span style={{color:"blue"}}>Food Feedback : </span>  {feedback.feedback}</Text>
                                </Box>
                            ))}
                        </SimpleGrid>
                    </Box>
                </Center>
            </Box>
        </Box>
    );
}

export default AdminFeedback;

import { useState } from "react";
import {
    Box,
    Button,
    Center,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Textarea,
    Heading,
    useToast
} from "@chakra-ui/react";
import Navbar from "@/components/Navbar";
import { collection, addDoc } from "firebase/firestore";
import {database} from "../../lib/firebase";

function Feedback() {
    const [foodQuality, setFoodQuality] = useState("");
    const [foodQuantity, setFoodQuantity] = useState("");
    const [donorName, setDonorName] = useState("");
    const [feedback, setFeedback] = useState("");
    const toast = useToast();

    const handleFeedbackSubmit = async () => {
        try {
            const feedbackRef = collection(database, "feedback");
            await addDoc(feedbackRef, {
                foodQuality,
                foodQuantity,
                donorName,
                feedback,
            });
            toast({
                title: "Feedback submitted",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            // Reset form values
            setFoodQuality("");
            setFoodQuantity("");
            setDonorName("");
            setFeedback("");
        } catch (error) {
            console.error("Error submitting feedback:", error);
            toast({
                title: "An error occurred",
                description: "Failed to submit feedback, please try again later.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Box
            w={"100%"}
            bgImage="url(https://duolearn-public.s3.ap-south-1.amazonaws.com/pexels-julia-m-cameron-6994963.jpg)"
            bgSize="cover"
            bgPosition="center"
            minH="100vh"
        >
            <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="rgba(0,0,0,0.5)"
            />
            <Navbar />
            <Box p={8}>
                <Center>
                    <Stack spacing={5} w="400px" color={"white"}>
                        <Heading>SUBMIT FEEDBACK</Heading>
                        <FormControl id="foodQuality">
                            <FormLabel>Food Quality (OUT OF 10) </FormLabel>
                            <Input
                                type="number"
                                value={foodQuality}
                                onChange={(e) => setFoodQuality(e.target.value)}
                            />
                        </FormControl>1
                        <FormControl id="foodQuantity">
                            <FormLabel>Food Quantity (OUT OF 10) </FormLabel>
                            <Input
                                type="number"
                                value={foodQuantity}
                                onChange={(e) => setFoodQuantity(e.target.value)}
                            />
                        </FormControl>
                        <FormControl id="donorName">
                            <FormLabel>Donor Name</FormLabel>
                            <Input
                                type="text"
                                value={donorName}
                                onChange={(e) => setDonorName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl id="feedback">
                            <FormLabel>Feedback</FormLabel>
                            <Textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                            />
                        </FormControl>
                        <Button onClick={handleFeedbackSubmit} color={"blue.500"}>
                            Submit Feedback
                        </Button>
                    </Stack>
                </Center>
            </Box>
        </Box>


    );
}

export default Feedback;

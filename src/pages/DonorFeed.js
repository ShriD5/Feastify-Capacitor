import { useEffect, useState } from "react";
import {
    Box,
    Center,
    Container,
    Image,
    SimpleGrid,
    Stack,
    Text,
    Button,
    useDisclosure, useToast
} from "@chakra-ui/react";
import {collection, doc, getDocs, updateDoc} from "firebase/firestore";
import Navbar from "@/components/Navbar";
import {database} from "../../lib/firebase";
import {AddIcon, Icon} from "@chakra-ui/icons";
import {useRouter} from "next/router";
import BackButton from "@/components/IconButton";

const DonorFeed = () => {
    const toast = useToast() ;
    const [isLoading, setIsLoading] = useState(false);
    const [foodItems, setFoodItems] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
const router = useRouter() ;

    useEffect(() => {
        const fetchFoodItems = async () => {
            const querySnapshot = await getDocs(collection(database, "food-items"));
            const fetchedFoodItems = [];
            querySnapshot.forEach((doc) =>
                fetchedFoodItems.push({ id: doc.id, ...doc.data() })
            );
            setFoodItems(fetchedFoodItems);
        };
        fetchFoodItems();
    }, []);


    const handlePickup = async (id) => {
        const updatedFoodItems = [...foodItems];
        const foodItemIndex = updatedFoodItems.findIndex((item) => item.id === id);
        updatedFoodItems[foodItemIndex].status = "Approved";
        setFoodItems(updatedFoodItems);

        // Update the status of the food item in Firestore
        const foodItemRef = doc(database, "food-items", id);
        await updateDoc(foodItemRef, { status: "Approved" });
        toast({
            title: "Pickup Request Approved",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
        // Disable the button after it is clicked
        const button = document.getElementById(`button-${id}`);
        button.disabled = true;
        button.textContent = "Approved";
    };
    const handleDeny = async (id) => {
        const updatedFoodItems = [...foodItems];
        const foodItemIndex = updatedFoodItems.findIndex((item) => item.id === id);
        updatedFoodItems[foodItemIndex].status = "Denied";
        setFoodItems(updatedFoodItems);

        // Update the status of the food item in Firestore
        const foodItemRef = doc(database, "food-items", id);
        await updateDoc(foodItemRef, { status: "Denied" });

        // Show a toast message to the user
        toast({
            title: "Pickup Request Denied",
            status: "error",
            duration: 3000,
            isClosable: true,
        });
        // Disable the button after it is clicked
        const button = document.getElementById(`button-${id}`);
        button.disabled = true;
        button.textContent = "Denied";
    };
    return (
        <Box w={"100%"}  bgImage="url(https://duolearn-public.s3.ap-south-1.amazonaws.com/pexels-julia-m-cameron-6994963.jpg)"
             bgSize="cover"
             bgPosition="center"
             minH="100vh" >
            <Navbar />
            <Container maxW={"container.xl"} py={8}>
                <Center>
                    <Box d={{ base: "block", md: "none" }}>
                        <BackButton route="/Donor" />
                    </Box>
                    <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={8}>
                        {foodItems.map((foodItem) => (
                            <Box
                                key={foodItem.id}
                                bg={"white"}
                                boxShadow={"md"}
                                rounded={"md"}
                                overflow={"hidden"}
                            >
                                <Image
                                    src={foodItem.image}
                                    alt={foodItem.name}
                                    objectFit={"cover"}
                                    h={"200px"}
                                    w={"100%"}
                                />
                                <Box p={4}>
                                    <Stack spacing={2} >
                                        <Text fontWeight={"bold"}>{foodItem.name}</Text>
                                        <Text><span style={{color:"blue"}}>Servings available: </span>{foodItem.amount} </Text>
                                        <Text>
                                            <span style={{color:"blue"}}> Ready to eat until: </span> {foodItem.time} from now.
                                        </Text>
                                        <Text> <span style={{color:"blue"}}>Contact for pickup:</span> {foodItem.location}</Text>
                                        {foodItem.requestedQuantity ?   <Text> <span style={{color:"blue"}}>Requested Quantity:</span> {foodItem.requestedQuantity}</Text> : null }

                                        {foodItem.status === "still waiting" ? null : (
                                            <>
                                                <Button
                                                    id={`button-${foodItem.id}`}
                                                    color="blue.500"
                                                    onClick={() => handlePickup(foodItem.id)}
                                                    disabled={foodItem.status === "Approved"}
                                                    cursor={foodItem.status === "Approved" ? "not-allowed" : "pointer"}
                                                >
                                                    {foodItem.status === "Approved" ? "Approved" : "Approve Pickup"}
                                                </Button>
                                                <Button
                                                    id={`button-${foodItem.id}-deny`}
                                                    color="red.500"
                                                    onClick={() => handleDeny(foodItem.id)}
                                                    disabled={foodItem.status === "Denied"}
                                                    cursor={foodItem.status === "Denied" ? "not-allowed" : "pointer"}
                                                >
                                                    {foodItem.status === "Denied" ? "Denied" : "Deny Pickup"}
                                                </Button>
                                            </>
                                        )}
                                    </Stack>
                                </Box>
                            </Box>
                        ))}
                    </SimpleGrid>
                    <Button
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
                        onClick={() => router.push("/AddFood")}
                    >
                        <AddIcon />
                    </Button>
                </Center>
            </Container>
        </Box>
    );

};

export default DonorFeed;

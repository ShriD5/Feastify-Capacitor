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
    useDisclosure,
    useToast,
    Spinner,
    NumberIncrementStepper,
    NumberInputStepper,
    NumberInputField,
    NumberInput,
    FormLabel, FormControl, NumberDecrementStepper
} from "@chakra-ui/react";
import { collection, getDocs, updateDoc, doc, setDoc } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import {database} from "../../lib/firebase";
import {AddIcon, CheckIcon, Icon} from "@chakra-ui/icons";
import BackButton from "@/components/IconButton";

const FoodItems = () => {
    const toast = useToast();
    const [foodItems, setFoodItems] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [requestSent, setRequestSent] = useState(Array(foodItems.length).fill(false));

    useEffect(() => {
        const fetchFoodItems = async () => {
            const querySnapshot = await getDocs(collection(database, "food-items"));
            const fetchedFoodItems = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                fetchedFoodItems.push({
                    id: doc.id,
                    ...data,
                    requestedQuantity: data.requestedQuantity || 0, // add requestedQuantity field and default to 0 if it doesn't exist
                });
            });
            setFoodItems(fetchedFoodItems);
        };
        fetchFoodItems();
    }, []);

    const handleRequestPickup = async (foodItemId, requestedQuantity, index) => {
        setIsLoading(true);
        await updateDoc(doc(database, "food-items", foodItemId), {
            status: "Requesting",
            requestedQuantity: requestedQuantity,
        });
        const querySnapshot = await getDocs(collection(database, "food-items"));
        const fetchedFoodItems = [];
        querySnapshot.forEach((doc) =>
            fetchedFoodItems.push({ id: doc.id, ...doc.data() })
        );
        const updatedRequestSent = [...requestSent];
        updatedRequestSent[index] = true;
        setRequestSent(updatedRequestSent);
        setFoodItems(fetchedFoodItems);
        toast({
            title: "Pickup Request Sent",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
        setIsLoading(false);
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
                        <BackButton route="/Volunteer" />
                    </Box>
                    <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={8}>
                        {foodItems.map((foodItem, index) => (
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
                                    <Stack spacing={2}>
                                        <Text fontWeight={"extrabold"}><span style={{color:"blue"}}> Food: </span> {foodItem.name}</Text>
                                        <Text> <span style={{color:"blue"}}>Quantity available: </span>{foodItem.amount} </Text>
                                        <Text>
                                            <span style={{color:"blue"}}>  Ready to eat till: </span>  {foodItem.time} from now.
                                        </Text>
                                        <Text><span style={{color:"blue"}}>Contact for pickup:  </span>{foodItem.location}</Text>
                                        <FormControl>
                                            <FormLabel htmlFor="quantity" mt={2} fontWeight={"extrabold"}><span style={{color:"blue"}}> Quantity: </span></FormLabel>
                                            <NumberInput defaultValue={1} min={1} max={foodItem.amount} isDisabled={foodItem.status === "Requesting"} id="quantity">
                                                <NumberInputField />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>
                                        </FormControl>
                                        <Button
                                            colorScheme="blue"
                                            disabled={
                                                isLoading ||
                                                requestSent[index] ||
                                                foodItem.requestedQuantity > 0
                                            }
                                            onClick={() =>
                                                handleRequestPickup(foodItem.id, parseInt(quantity), index)
                                            }
                                        >
                                            {isLoading ? (
                                                <>
                                                    Sending request... <Spinner ml={2} size="sm" />
                                                </>
                                            ) : requestSent[index] ? (
                                                <>
                                                    Request Sent <CheckIcon ml={2} />
                                                </>
                                            ) : (
                                                "Request Pickup"
                                            )}
                                        </Button>

                                    </Stack>
                                </Box>
                            </Box>
                        ))}
                    </SimpleGrid>
                </Center>
            </Container>
        </Box>
    );
};

export default FoodItems;

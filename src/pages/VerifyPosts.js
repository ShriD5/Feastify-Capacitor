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
    useDisclosure, Heading
} from "@chakra-ui/react";
import { collection, doc, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import { database } from "../../lib/firebase";
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import {useRouter} from "next/router";

const AdminDashboard = () => {
    const [isLoading, setIsLoading] = useState(false);
const  router = useRouter() ;
    const [foodItems, setFoodItems] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();


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
        updatedFoodItems[foodItemIndex].status = "accepted";
        setFoodItems(updatedFoodItems);

        // Update the status of the food item in Firestore
        const foodItemRef = doc(database, "food-items", id);
        await updateDoc(foodItemRef, { status: "accepted" });
    };


    const handleDelete = async (id) => {
        const foodItemRef = doc(database, "food-items", id);
        await deleteDoc(foodItemRef);
        const updatedFoodItems = foodItems.filter((item) => item.id !== id);
        setFoodItems(updatedFoodItems);
    };

    return (
        <Box w={"100%"} bgImage="url(https://duolearn-public.s3.ap-south-1.amazonaws.com/pexels-julia-m-cameron-6994963.jpg)"
             bgSize="cover"
             bgPosition="center"
             minH="100vh"
blur={'xl'}        >

            <Navbar />
            <Container maxW={"container.xl"} py={8}>
                <Center>
                    <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={8}>
                        <Heading fontSize={'5xl'} >Hello Admin !</Heading>
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
                                    <Stack spacing={2}>
                                        <Text fontWeight={"bold"}>{foodItem.name}</Text>
                                        <Text> <span style={{fontWeight:"bolder" , color:"blue"}} > Servings Available:</span> {foodItem.amount} </Text>
                                        <Text>
                                      <span style={{fontWeight:"bolder" , color:"blue"}} > Ready to eat in :</span>  {foodItem.time} from now.
                                        </Text>
                                        <Text> <span style={{fontWeight:"bolder" , color:"blue"}} > Contact for Pickup:</span> {foodItem.location}</Text>
                                        <Text> <span style={{fontWeight:"bolder" , color:"blue"}} > Status:</span> {foodItem.status}</Text>

                                        {/*<Button color="blue.500" onClick={() => handlePickup(foodItem.id)} disabled={foodItem.status === "accepted"}>*/}
                                        {/*{foodItem.status === "accepted" ? "Accepted" : "Pickup"}*/}
                                        {/*    </Button>*/}
                                            <Stack direction="row" mt={2} alignItems={'center'} justifyContent={'center'} >
                                            <Button leftIcon={<DeleteIcon />} colorScheme="red" onClick={() => handleDelete(foodItem.id)}>
                                                Delete
                                            </Button>
                                    </Stack>
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

export default AdminDashboard;
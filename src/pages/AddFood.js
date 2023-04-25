import { useState } from "react";
import {
    Box,
    Button,
    Center, Container,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Textarea,
    Link
} from "@chakra-ui/react";
import Navbar from "@/components/Navbar";
import { getFirestore, collection, addDoc , doc , updateDoc} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app, { database  } from "../../lib/firebase";
import {useRouter} from "next/router";
import BackButton from "@/components/IconButton";

const AddFood = () =>  {
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(false);
const router = useRouter() ;
    const handleFoodItemSubmit = async (foodItem) => {
        try {
            setLoading(true); // Set loading to true
            const { name, image, amount, time, location, status } = foodItem;

            // Upload image to Firebase Storage
            const storage = getStorage(app) ;
            const storageRef = ref(storage, `food-items/${image.name}`);
            const uploadTask = uploadBytes(storageRef, image);
            await uploadTask;

            // Get image URL from Firebase Storage
            const imageRef = ref(storage, `food-items/${image.name}`);
            const downloadURL = await getDownloadURL(imageRef);

            // Add food item to Firestore
            const docRef = addDoc(collection(database, "food-items"), {
                name,
                image: downloadURL,
                amount,
                time,
                location,
                status,
            });
            setFoodItems([...foodItems, foodItem]);
             await router.push("/DonorFeed")
            setLoading(false); // Set loading to false in case of error

        } catch (error) {
            console.error(error);
        }
    };

    // const handlePickup = async (id) => {
    //     const updatedFoodItems = [...foodItems];
    //     const foodItemIndex = updatedFoodItems.findIndex((item) => item.id === id);
    //     updatedFoodItems[foodItemIndex].status = "accepted";
    //     setFoodItems(updatedFoodItems);
    //
    //     // Update the status of the food item in Firestore
    //     const foodItemRef = doc(database, "food-items", id);
    //     await updateDoc(foodItemRef, { status: "accepted" });
    // };

    return (
        <Box w={"100%"}  bgImage="url(https://duolearn-public.s3.ap-south-1.amazonaws.com/pexels-julia-m-cameron-6994963.jpg)"
             bgSize="cover"
             bgPosition="center"
             minH="100vh"
             position="relative">
            <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="rgba(0,0,0,0.5)"
            />
            <Navbar />
            <Box p={8} >
                <Center>
                    <Box d={{ base: "block", md: "none" }}>
                        <BackButton route="/Donor" />
                    </Box>
                    <Box w="800px" gap={'5'}>
                        <Box mb={4} >
                            <FormControl id="foodName">
                                <FormLabel color="white">Food Name</FormLabel>
                                <Input type="text" color="white"/>
                            </FormControl>
                            <FormControl id="foodImage" >
                                <FormLabel color="white">Food Image</FormLabel>
                                <Input type="file" accept="image/*" color="white"/>
                            </FormControl>
                            <FormControl id="foodAmount">
                                <FormLabel color="white">Amount of Food Available</FormLabel>
                                <Input type="number" color="white"/>
                            </FormControl>
                        </Box>
                        <Box mb={4}>
                            <FormControl id="foodTime">
                                <FormLabel color="white">Time Till Food Can Be Eaten</FormLabel>
                                <Input type="text" color="white"/>
                            </FormControl>
                            <FormControl id="foodLocation" >
                                <FormLabel color="white">Food Location and Address Contact</FormLabel>
                                <Textarea color="white"/>
                            </FormControl>
                            <FormControl id="foodStatus">
                                <FormLabel color="white">Food Status</FormLabel>
                                <Input type="text" value="Available" readOnly color="white"/>
                            </FormControl>
                        </Box>
                        <Button
                            mb={4}
                            onClick={() =>
                                handleFoodItemSubmit({
                                    name: document.getElementById("foodName").value,
                                    image: document.getElementById("foodImage").files[0],
                                    amount: document.getElementById("foodAmount").value,
                                    time: document.getElementById("foodTime").value,
                                    location: document.getElementById("foodLocation").value,
                                    status: "still waiting",
                                })
                            }
                            isLoading={foodItems.length > 0}
                        >
                            Add Food Item
                        </Button>
                    </Box>
                </Center>
            </Box>
        </Box>

    );
}

export default AddFood ;

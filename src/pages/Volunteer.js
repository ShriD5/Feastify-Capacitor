import {Box, Button, Center, Container, Flex, Heading, Stack} from "@chakra-ui/react";
import Navbar from "@/components/Navbar";
import {useRouter} from "next/router";
import BackButton from "@/components/IconButton";

const Volunteer = () => {
    const router = useRouter();
    return (
        <Box
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
            <Container maxW={"container.lg"}>
                <Center h="full">
                    <Box d={{ base: "block", md: "none" }}>
                        <BackButton route="/" />
                    </Box>
                    <Stack align="center" spacing={8}>

                        <Stack pt={'100%'} direction={{ base: "column", md: "row" }} spacing={4}>
                            <Button colorScheme="blue" size="lg" fontSize="xl" onClick={() => router.push('/FoodItems')} >
                                Request Food
                            </Button>
                            <Button colorScheme="gray" size="lg" fontSize="xl" onClick={() => router.push('/AddLocation')}>
                                Add Location Details
                            </Button>
                        </Stack>
                    </Stack>
                </Center>
            </Container>
        </Box>
    );
};

export default Volunteer;

import { useState } from "react";
import {
    Link,
    Box,
    Flex,
    IconButton,
    useDisclosure,
    VStack,
    Text,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Image, useToast,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import useAuth from "../hooks/useAuth";
import useUserRole from "@/hooks/useUserRole";
import { auth } from "../../lib/firebase";
import {useRouter} from "next/router";

function MobileNavbar() {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [activeTab, setActiveTab] = useState("");
    const userRole = useUserRole();
    console.log(userRole)
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await auth.signOut();
            await router.push("/")
            toast({
                title: "Successfully Signed out",
                description: `You have successfully signed out`,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.log("Error logging out: ", error.message);
        }
    };

    return (
        <Box w={"100%"}>
            <Flex
                as="nav"
                align="center"
                justify="space-between"
                wrap="wrap"
                padding={4}
                bg="blue.500"
                w={"100%"}
                justifyContent="space-between"
            >
                <Text
                    color={"white"}
                    fontSize={"4xl"}
                    fontWeight={"extrabold"}
                    fontFamily={"montserrat"}
                >
                    Feastify
                </Text>
                <IconButton
                    size="md"
                    icon={<HamburgerIcon />}
                    aria-label="Open menu"
                    display={{ md: "none" }}
                    onClick={onOpen}
                    mr={2}
                />
            </Flex>
            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Menu</DrawerHeader>

                    <DrawerBody>
                        <VStack spacing={4} align="stretch">
                            <Text
                                cursor={"pointer"}
                                fontWeight={"normal"}
                                onClick={handleLogout}
                            >
                                Logout
                            </Text>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Box>
    );
}

export default MobileNavbar;

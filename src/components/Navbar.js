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
    let links = [];

    if (userRole === "donor") {
        links = [
            { to: "/AddFood", label: "Add Food" },
            { to: "/DonorFeed", label: "Donor Feed" },
        ];
    } else if (userRole === "volunteer") {
        links = [
            { to: "/FoodItems", label: "Food Items" },
            { to: "/AddLocation", label: "Add Location" },
            { to: "/GiveFeedback", label: "Give Feedback" },
        ];
    } else if (userRole === "admin") {
        links = [{ to: "/AdminMenu", label: "Admin Menu" }];
    }

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
                    fontSize={"3xl"}
                    fontWeight={"extrabold"}
                    fontFamily={"sans-serif"}
                >
                    DonorPal
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
                            {links.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setActiveTab(link.label)}
                                >
                                    <Text
                                        fontWeight={
                                            activeTab === link.label ? "bold" : "normal"
                                        }
                                    >
                                        {link.label}
                                    </Text>
                                </Link>
                            ))}
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

import { ArrowBackIcon } from "@chakra-ui/icons";
import { IconButton, useBreakpointValue } from "@chakra-ui/react";
import { useRouter } from "next/router";

const BackButton = ({route}) => {
    const router = useRouter();
    const isMobile = useBreakpointValue({ base: true, md: false });

    return (
        <>
            {isMobile && (
                <IconButton
                    aria-label="Go back"
                    icon={<ArrowBackIcon />}
                    onClick={() => router.push(route)}
                    position="fixed"
                    bottom={4}
                    left={4}
                    borderRadius="full"
                    boxShadow="md"
                    bg="white"
                    color="blue.500"
                    _hover={{ bg: "blue.500", color: "white" }}
                />
            )}
        </>
    );
};

export default BackButton;

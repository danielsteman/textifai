import { Box, Text, Center, Button } from "@chakra-ui/react"

const PromoTiara = () => {
    return (
        <Box w="100%" p={2} bgGradient="linear(to-l, #7928CA, #FF0080)">
            <Center gap={4}>
                <Text size="sm" color={"white"}>
                    Check out our promo 💎
                </Text>
                <Button
                    size="sm"
                    variant={"solid"}
                    bgColor="black"
                    textColor={"white"}
                    rounded={2}
                >
                    Learn more
                </Button>
            </Center>
        </Box>
    )
}

export default PromoTiara;

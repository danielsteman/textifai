import {
    Box,
    Avatar,
    Text,
    Button,
    VStack,
    HStack,
    Alert,
    AlertIcon,
    Input,
    FormControl,
    FormLabel
} from "@chakra-ui/react";

const UserSettings = () => {
    // Mock user data
    const user = {
        avatarUrl: "URL_OF_USER_AVATAR",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        emailVerified: false
    };

    return (
        <Box p="2rem" maxWidth="38rem" mx="auto">
            <VStack spacing="1.5rem" align="start">
                {/* Avatar */}
                <HStack spacing="1rem">
                    <Avatar size="xl" src={user.avatarUrl} />
                    <VStack align="start">
                        <Text fontSize="1.25rem">{`${user.firstName} ${user.lastName}`}</Text>
                        <Text>{user.email}</Text>
                        {!user.emailVerified && (
                            <Alert status="warning" variant="left-accent">
                                <AlertIcon />
                                Your email is not verified. Click here to verify.
                            </Alert>
                        )}
                    </VStack>
                </HStack>

                {/* Change/Reset Password */}
                <Box>
                    <Text fontSize="1.125rem" mb="1rem">Change Password</Text>
                    <FormControl>
                        <FormLabel>Current Password</FormLabel>
                        <Input type="password" placeholder="Enter current password" />
                    </FormControl>
                    <FormControl mt="1rem">
                        <FormLabel>New Password</FormLabel>
                        <Input type="password" placeholder="Enter new password" />
                    </FormControl>
                    <FormControl mt="1rem">
                        <FormLabel>Confirm New Password</FormLabel>
                        <Input type="password" placeholder="Confirm new password" />
                    </FormControl>
                    <Button mt="1rem" colorScheme="blue">Change Password</Button>
                </Box>
            </VStack>
        </Box>
    );
};

export default UserSettings;

import {
    Box,
    Flex,
    Text,
    Divider,
    Input,
    Button,
    Avatar,
    HStack
  } from "@chakra-ui/react";
  import SidebarMenu from "../../common/components/SidebarMenu";
  
  const AccountSettings = () => {
    const user = {
      avatarUrl: "URL_OF_USER_AVATAR",
      firstName: "Henk",
      lastName: "de Tank",
      email: "henk.detank@example.com",
      emailVerified: false
    };
  
    return (
        <Box p={6} boxShadow="base" borderRadius="md" bg="white" flex="1">
          <Text fontSize="2xl" mb={4}>Account settings</Text>
  
          {/* Profile Section */}
          <Text fontSize="xl" mb={4}>Profile</Text>
          <Flex alignItems="center" mb={4}>
            <Avatar name={`${user.firstName} ${user.lastName}`} src={user.avatarUrl} />
            <Button ml={4}>Change Avatar</Button>
          </Flex>
          <Box mb={4}>
            <Text mb={2}>First Name</Text>
            <Input size="sm" placeholder="First Name" borderRadius="md" defaultValue={user.firstName} />
          </Box>
          <Box mb={4}>
            <Text mb={2}>Last Name</Text>
            <Input size="sm" placeholder="Last Name" borderRadius="md" defaultValue={user.lastName} />
          </Box>
  
          <Divider my={6} />
  
          {/* Email and PhoneNumber Section */}
          <Text fontSize="xl" mb={4}>Email & Phone</Text>
          <Box mb={4}>
            <Text mb={2}>Email</Text>
            <Input size="sm" type="email" placeholder="Email" borderRadius="md" defaultValue={user.email} />
            {!user.emailVerified && <Text color="red.500">Email not verified</Text>}
          </Box>
          <Box mb={4}>
            <Text mb={2}>Phone Number</Text>
            <Input size="sm" type="tel" placeholder="Phone Number" />
          </Box>
  
          <Divider my={6} />
  
          {/* Change Password Section */}
          <Text fontSize="xl" mb={4}>Change Password</Text>
          <Box mb={4}>
            <Text mb={2}>Old Password</Text>
            <Input size="sm" type="password" borderRadius="md" placeholder="Old Password" />
          </Box>
          <Box mb={4}>
            <Text mb={2}>New Password</Text>
            <Input size="sm" type="password" borderRadius="md" placeholder="New Password" />
          </Box>
          <Box mb={4}>
            <Text mb={2}>Confirm Password</Text>
            <Input size="sm" type="password" borderRadius="md" placeholder="Confirm Password" />
          </Box>
  
          <Divider my={6} />
  
          {/* Delete Account */}
          <Text color="red.500" fontSize="xl" mb={4}>
            Delete Account
          </Text>
          <Button colorScheme="red">Delete My Account</Button>
        </Box>
    );
  };
  
  export default AccountSettings;
  
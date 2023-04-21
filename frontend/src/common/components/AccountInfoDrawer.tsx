import { MdColorLens, MdPayment, MdSettings } from "react-icons/md";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Text,
  VStack,
  HStack,
} from "@chakra-ui/react";
import AccountAvatar from "./AccountAvatar";
import SettingsMenuItem from "./SettingsMenuItem";

const AccountInfoDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fakeUser = "Daniel";
  return (
    <>
      <AccountAvatar onClick={onOpen} />
      <Drawer placement="right" onClose={onClose} isOpen={isOpen} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            <HStack gap={4}>
              <AccountAvatar size={"md"} />
              <VStack alignItems={"left"} my={0}>
                <Text fontWeight={500} fontSize={16}>
                  Welcome back,{" "}
                </Text>
                <Text fontWeight={700} fontSize={18}>
                  {fakeUser}
                </Text>
              </VStack>
            </HStack>
          </DrawerHeader>
          <DrawerBody>
            <VStack gap={2} alignItems="left">
              <SettingsMenuItem name={"Account"} icon={MdSettings}>
                Manage your account settings
              </SettingsMenuItem>
              <SettingsMenuItem name={"Subscriptions"} icon={MdPayment}>
                Manage your active subscriptions
              </SettingsMenuItem>
              <SettingsMenuItem name={"Appearance"} icon={MdColorLens}>
                Manage the appearance of the web app
              </SettingsMenuItem>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default AccountInfoDrawer;

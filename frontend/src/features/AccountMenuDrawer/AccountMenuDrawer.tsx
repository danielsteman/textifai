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
import AccountAvatar from "../../common/components/AccountAvatar";
import MenuItem from "../../common/components/MenuItem";

const AccountMenuDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fakeUser = "Daniel";
  return (
    <>
      <AccountAvatar onClick={onOpen} />
      <Drawer
        placement="right"
        onClose={onClose}
        isOpen={isOpen}
        size="xs"
        autoFocus={false}
      >
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
              <MenuItem name={"Account"} icon={MdSettings} href="/settings" />
              <MenuItem
                name={"Subscriptions"}
                icon={MdPayment}
                href="/settings"
              />
              <MenuItem
                name={"Appearance"}
                icon={MdColorLens}
                href="/settings"
              />
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default AccountMenuDrawer;

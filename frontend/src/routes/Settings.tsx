import { Grid, GridItem } from "@chakra-ui/react";
import { MdColorLens, MdPayment, MdSettings } from "react-icons/md";
import SettingsMenuItem from "../components/SettingsMenuItem";

const Settings = () => {
  return (
    <Grid templateColumns="repeat(4, 1fr)" gap={4} p={4}>
      <GridItem colSpan={1} bg="tomato">
        <SettingsMenuItem headerText={"Account"} icon={MdSettings}>
          Manage your account settings
        </SettingsMenuItem>
        <SettingsMenuItem headerText={"Subscriptions"} icon={MdPayment}>
          Manage your active subscriptions
        </SettingsMenuItem>
        <SettingsMenuItem headerText={"Appearance"} icon={MdColorLens}>
          Manage the appearance of the web app
        </SettingsMenuItem>
      </GridItem>
      <GridItem colSpan={3} bg="teal" />
    </Grid>
  );
};

export default Settings;

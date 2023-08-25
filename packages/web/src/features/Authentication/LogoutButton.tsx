import { IconButton, Tooltip } from "@chakra-ui/react";
import { MdLogout } from "react-icons/md";
import { auth } from "../../app/config/firebase";

const LogoutButton = () => (
  <Tooltip label="Sign out">
    <IconButton
      size="sm"
      onClick={() => auth.signOut()}
      icon={<MdLogout />}
      aria-label="Sign out"
      w="fit-content"
    />
  </Tooltip>
);

export default LogoutButton;

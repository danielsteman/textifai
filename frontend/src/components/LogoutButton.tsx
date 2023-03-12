import { Button } from "@chakra-ui/react";
import auth from "../config/firebase";

const LogoutButton = () => (
  <Button size="sm" onClick={() => auth.signOut()}>Sign out</Button>
)

export default LogoutButton;
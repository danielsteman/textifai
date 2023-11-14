import { Text, Icon, Button, useDisclosure } from "@chakra-ui/react";
import {
  GoogleAuthProvider,
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import React from "react";
import { IconType } from "react-icons";
import { useNavigate } from "react-router-dom";
import { facebookProvider } from "../../app/auth/auth_facebook_provider_create";
import { auth, db } from "../../app/config/firebase";
import { formatPropString } from "../../common/utils/formatStrings";
import { User } from "@shared/interfaces/firebase/User";
import { Color } from "../../shared/app.types";
import { SocialsProps } from "./Socials";
import { doc, getDoc, Timestamp, setDoc } from "firebase/firestore";

interface SocialLoginButtonProps extends SocialsProps {
  socialMediaProvider: "Facebook" | "Google";
  icon: IconType;
  color: Color;
  index?: number;
}

const SocialLoginButton: React.FC<SocialLoginButtonProps> = (props) => {
  const buttonText = `${props.loginOrRegister} with ${props.socialMediaProvider}`;
  const formattedButtonText = formatPropString(buttonText);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSignInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
          const userData: User = {
            userId: user.uid,
            firstName: user.displayName ? user.displayName.split(" ")[0] : "",
            lastName: user.displayName ? user.displayName.split(" ")[1] : "",
            email: user.email || "",
            admin: [],
            avatarUrl: user.photoURL || "",
            createdDate: Timestamp.fromDate(new Date()),
            updatedDate: Timestamp.fromDate(new Date()),
            language: "english",
            isActive: true,
          };

          await setDoc(userRef, userData);
        }
        navigate("/features/workspace");
      }

      onClose();
    } catch (error) {
      console.error("Error signing in with Google:", error);
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        typeof error.code === "string"
      ) {
        setError(error.code);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const handleSubmit = async () => {
    switch (props.socialMediaProvider) {
      case "Google":
        await handleSignInWithGoogle();
        break;

      case "Facebook":
        signInWithRedirect(auth, facebookProvider);
        getRedirectResult(auth)
          .then(() => {
            navigate("/products");
          })
          .catch((error) => {
            console.log(error);
          });
        break;

      default:
        console.log(
          "socialMediaProvider in SocialLoginButtonProps was not matched"
        );
        break;
    }
  };

  return (
    <Button
      onClick={handleSubmit}
      colorScheme={props.socialMediaProvider.toLowerCase()}
      p={2}
      rounded={5}
      w="100%"
      key={props.index}
    >
      <Icon as={props.icon} color="white" boxSize={5} mr={2} />
      <Text color={"white"} fontWeight={600}>
        {formattedButtonText}
      </Text>
    </Button>
  );
};

export default SocialLoginButton;
function setError(code: string) {
  throw new Error("Function not implemented.");
}

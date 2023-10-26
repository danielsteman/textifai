import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
  Button,
} from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/react";
import theme from "../../app/themes/theme";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../app/providers/AuthProvider";
import { resendVerificationEmail } from "../../features/Authentication/resendVerificationMail";
import { handleOOBCode } from "../../features/Authentication/updateEmailVerification";

const EmailVerification = () => {
  const { colorMode } = useColorMode();
  const currentUser = useContext(AuthContext);
  const [mailResent, setMailResent] = useState(false);

  const navigate = useNavigate();

  const handleResendClick = () => {
    if (currentUser) {
      resendVerificationEmail(currentUser);
      setMailResent(true);
    } else {
      console.warn(
        "Failed to send verification email because there is no logged in user"
      );
    }
  };

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const oobCode = queryParams.get("oobCode");

  useEffect(() => {
    if (oobCode) {
      (async () => {
        const isSuccess = await handleOOBCode(oobCode);
        if (isSuccess) {
          navigate("/features/onboarding");
        }
      })();
    }
  }, [oobCode, navigate]);

  return (
    <Modal isOpen={true} onClose={() => {}} isCentered size="md">
      <ModalOverlay />
      <ModalContent
        bgColor={theme.colors[colorMode].secondaryContainer}
        borderRadius="md"
      >
        <ModalHeader textColor={theme.colors[colorMode].onSecondaryContainer}>
          Verify your email
        </ModalHeader>
        <ModalBody>
          <Text mb={4}>
            We have sent an email to{" "}
            <span style={{ fontWeight: "bold" }}>{currentUser!.email}</span>. If
            you have not received the verification mail, please check your
            "Spam" folder. You can also click the resend button below to have
            another email sent to you.
          </Text>
        </ModalBody>
        <ModalFooter justifyContent="flex-start">
          <Button
            colorScheme={theme.colors[colorMode].onSecondaryContainer}
            textColor={theme.colors[colorMode].onSecondaryContainer}
            onClick={handleResendClick}
            p={0}
            isDisabled={mailResent}
          >
            {mailResent
              ? "Just resent another verification mail"
              : "Resend verification mail"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EmailVerification;

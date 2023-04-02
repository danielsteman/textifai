import { SmallCloseIcon } from "@chakra-ui/icons";
import { Box, Text, Center, Button, IconButton } from "@chakra-ui/react";
import { useState } from "react";

const PromoTiara: React.FC = () => {
  const [showPromo, setShowPromo] = useState<boolean>(true);

  if (showPromo) {
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
          <IconButton
            size={"sm"}
            variant={"outline"}
            icon={<SmallCloseIcon />}
            aria-label={"Close tiara"}
            onClick={() => setShowPromo(false)}
          />
        </Center>
      </Box>
    );
  } else {
    return null;
  }
};

export default PromoTiara;

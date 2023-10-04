import { SmallCloseIcon } from "@chakra-ui/icons";
import {
  useColorMode,
  GridItem,
  HStack,
  Heading,
  Spacer,
  IconButton,
  Box,
} from "@chakra-ui/react";
import theme from "../../app/themes/theme";

interface SupportWindowGridItemProps {
  children: React.ReactNode;
  windowName: string;
  onClose: () => void;
}

const SupportWindowGridItem: React.FC<SupportWindowGridItemProps> = ({
  children,
  windowName,
  onClose,
}) => {
  const { colorMode } = useColorMode();
  return (
    <GridItem
      overflowY="scroll"
      display="flex"
      flexDir="column"
      rowSpan={1}
      colSpan={1}
      bgColor={theme.colors[colorMode].surfaceContainer}
      h="100%"
      pb={2}
      borderRadius={8}
    >
      <HStack
        mb={2}
        pl={2}
        bgColor={theme.colors[colorMode].primaryContainer}
        borderTopRadius={8}
      >
        <Heading size="xs" color={theme.colors[colorMode].onPrimaryContainer}>
          {windowName}
        </Heading>
        <Spacer />
        <IconButton
          variant="ghost"
          size="xs"
          aria-label={"close"}
          icon={<SmallCloseIcon />}
          onClick={onClose}
        />
      </HStack>
      <Box overflowY="auto" h="100%">
        {children}
      </Box>
    </GridItem>
  );
};

export default SupportWindowGridItem;

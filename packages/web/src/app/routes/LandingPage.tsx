import {
  Box,
  Button,
  Center,
  Text,
  Grid,
  GridItem,
  Heading,
  useColorMode,
  VStack,
  HStack,
  Image,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import theme from "../themes/theme";
import { useContext, useEffect } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { useDispatch } from "react-redux";
import { openSignUpModal } from "../../features/Authentication/loginOrRegisterModalSlice";

interface Props {
  imageSrc: string;
}

const PlaceHolder: React.FC<Props> = ({ imageSrc }) => {
  return (
    <Center>
      <Box>
        <Image src={imageSrc} />
      </Box>
    </Center>
  );
};

interface ParagraphProps {
  heading: string;
  children: React.ReactNode;
  CTAButton?: React.ReactNode;
}

const Paragraph: React.FC<ParagraphProps> = ({
  heading,
  children,
  CTAButton,
}) => {
  const { colorMode } = useColorMode();
  return (
    <Center>
      <VStack px={[0, 12, 12]} align="start" gap={8} w={["80%", "90%"]}>
        <Heading
          size="2xl"
          fontWeight={800}
          textColor={`linear(to-l, ${theme.colors[colorMode].primary}, ${theme.colors[colorMode].tertiary})`}
        >
          {heading}
        </Heading>
        {children}
        {CTAButton}
      </VStack>
    </Center>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const currentUser = useContext(AuthContext);
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();

  useEffect(() => {
    if (currentUser) {
      navigate("/features/workspace");
    }
  }, []);

  return (
    <Grid
      templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]}
      pt={24}
      alignItems="center"
      rowGap={24}
      maxW={1280}
      justifyContent="center"
      mx="auto"
    >
      <GridItem colSpan={1} py={24}>
        <Center>
          <VStack px={[0, 12, 12]} align="start" gap={8} w={["80%", "90%"]}>
            <Heading
              size="3xl"
              fontWeight={950}
              textColor={`linear(to-l, ${theme.colors[colorMode].primary}, ${theme.colors[colorMode].tertiary})`}
            >
              Supercharge your analysis with TAI: your personal AI research
              assistant
            </Heading>
            <Heading size="md" fontWeight={400}>
              Textifai is your all-in-one research companion, streamlining
              search, organisation, analysis, and helping you produce faster.{" "}
              <br />
              <br />
              Don't just keep pace in the digital realm; lead the way. Dive in
              and realise why, with Textifai, every discovery feels
              groundbreaking.
            </Heading>
            <HStack gap={8}>
              <Button
                variant="outline"
                size="lg"
                onClick={() => dispatch(openSignUpModal())}
              >
                Get started
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/support")}
              >
                Get in touch
              </Button>
            </HStack>
          </VStack>
        </Center>
      </GridItem>
      <GridItem>
        <Box
          position="absolute"
          bottom="50%"
          transform="translateY(70%);"
          w="calc(55px + 50vw)"
          cursor="pointer"
          as="video"
          controls
          src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
          poster="https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217"
          objectFit="contain"
          sx={{
            aspectRatio: "16/9",
          }}
          autoPlay
          overflowX="hidden"
        />
      </GridItem>
      <GridItem>
        <PlaceHolder imageSrc="images/landingpage/Chat_Revolutioniseyourresearch.png" />
      </GridItem>
      <GridItem>
        <Paragraph heading="From fragmentation to unity: your research hub">
          <Text>
            Ever lost track of critical information amidst a tangle of tabs,
            tools, and storage platforms? Wrestling with the lineage of your
            references? Textifai consolidates your diverse data streams, from
            local files to API connections, into a singular, intuitive hub.{" "}
            <br />
            <br />
            No more jumping between disparate systems or fretting over missing
            pieces. With Textifai, your research finds coherence, lineage stands
            clear, and every insight is just a click away.
          </Text>
        </Paragraph>
      </GridItem>
      <GridItem>
        <Paragraph heading="Revolutionise your research: from overwhelm to clarity">
          <Text>
            Drowning in a sea of scattered information, unsure of source
            reliability and relevance? Textifai's AI-powered search refines your
            journey, guiding you to trusted sources while highlighting
            overlooked insights. Experience search results tailored to you and
            your industry, supported by credibility scores and
            cross-referencing.
            <br />
            <br />
            Our integrated connections with data portals expand your reach,
            while TAI proactively seeks both supporting and contradicting data.
            With Textifai, you don't just search; you discover.
          </Text>
        </Paragraph>
      </GridItem>
      <GridItem>
        <PlaceHolder imageSrc="images/landingpage/Editor_craftcollaborate.png" />
      </GridItem>
      <GridItem>
        <PlaceHolder imageSrc="images/landingpage/Library_yourresearchhub.png" />
      </GridItem>
      <GridItem>
        <Paragraph heading="Craft, collaborate, and conclude in one space">
          <Text>
            In the realm of research, disjointed tools can stifle creativity.
            Textifai’s unique editor mode redefines that experience. Here, while
            the TAI shoulders the bulk of work, it ensures your voice leads the
            symphony. For every five AI-crafted paragraphs, your insight forms
            the resonant sixth.
            <br />
            <br />
            Dive deep into your resources, weave in data, and collaborate with
            your team seamlessly. No more shuffling between platforms; Textifai
            embodies the essence of efficient, unified research.
          </Text>
        </Paragraph>
      </GridItem>
      <GridItem>
        <Paragraph heading="Textifai, for the curious">
          <Text>
            Discover the transformative power of TAI, Textifai's adaptive AI. As
            your research evolves, so does your TAI, fine-tuning its approach
            based on your feedback and unique requirements. Seamlessly
            partnering with you, the TAI navigates vast information landscapes,
            ensuring data reliability and extracting insights. No more sifting
            through the irrelevant or questioning source trustworthiness.
            <br />
            <br />
            The magic lies in the balance we strike: while the TAI does the
            heavy lifting, you remain firmly in the driver’s seat, guiding the
            journey, applying insights, and shaping conclusions.
          </Text>
        </Paragraph>
      </GridItem>
      <GridItem>
        <PlaceHolder imageSrc="images/landingpage/PDFViewer_Chat_Textifaiforthecurious.png" />
      </GridItem>
      <GridItem colSpan={2} pb={12} px={12}>
        <Center>
          <Text>© 2023 Textifai</Text>
        </Center>
      </GridItem>
    </Grid>
  );
};

export default LandingPage;

import {
  Box,
  Button,
  Center,
  Text,
  Grid,
  GridItem,
  Heading,
  useColorMode,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import theme from "../themes/theme";

const PlaceHolder = () => {
  const { colorMode } = useColorMode();
  return (
    <Center>
      <Box
        h={500}
        w={600}
        backgroundColor={theme.colors[colorMode].surfaceContainerHigh}
      ></Box>
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
  return (
    <Box px={24}>
      <Heading>{heading}</Heading>
      <Text>{children}</Text>
      {CTAButton}
    </Box>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={6} pt={24}>
      <GridItem>
        <Paragraph
          heading={"Textifai, for the curious"}
          CTAButton={
            <Button
              mt={8}
              variant="solid"
              size="lg"
              onClick={() => navigate("/features/onboarding")}
            >
              Get started
            </Button>
          }
        >
          <Text>
            Textifai is your all-in-one research companion, streamlining search,
            organisation, analysis, and helping you produce faster. <br />
            <br />
            Don't just keep pace in the digital realm; lead the way. Dive in and
            realise why, with Textifai, every discovery feels groundbreaking.
          </Text>
        </Paragraph>
      </GridItem>
      <GridItem>
        <PlaceHolder />
      </GridItem>
      <GridItem>
        <PlaceHolder />
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
        <PlaceHolder />
      </GridItem>
      <GridItem>
        <PlaceHolder />
      </GridItem>
      <GridItem>
        <Paragraph heading="Supercharge your analysis with TAI: your personal AI research assistant">
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
        <PlaceHolder />
      </GridItem>
    </Grid>
    // <Center
    //   bgGradient={`linear(to-l, ${theme.colors[colorMode].primary}, ${theme.colors[colorMode].tertiary})`}
    //   textAlign="center"
    //   flex="1"
    // >
    //   <Box maxW={500}>
    //     <Heading
    //       fontWeight={900}
    //       size="2xl"
    //       textColor={theme.colors[colorMode].surface}
    //     >
    //       Interact with your documents through chat ⚡
    //     </Heading>
    //     <Button
    //       mt={8}
    //       variant="solid"
    //       size="lg"
    //       onClick={() => navigate("/features/onboarding")}
    //     >
    //       Get started
    //     </Button>
    //   </Box>
    // </Center>
  );
};

export default LandingPage;

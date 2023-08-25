import {
  Center,
  Box,
  Grid,
  GridItem,
  Heading,
  HStack,
  Text,
  VStack,
  Button,
} from "@chakra-ui/react";
import { FaCheck } from "react-icons/fa";

const pricingData = [
  {
    title: "Free",
    price: 0,
    nProjects: 5,
    features: [
      { body: "feature 1", included: true },
      { body: "feature 2", included: true },
      { body: "feature 3", included: false },
      { body: "feature 4", included: false },
      { body: "feature 5", included: false },
    ],
  },
  {
    title: "Premium",
    price: 5,
    nProjects: 69,
    features: [
      { body: "feature 1", included: true },
      { body: "feature 2", included: true },
      { body: "feature 3", included: true },
      { body: "feature 4", included: false },
      { body: "feature 5", included: false },
    ],
  },
  {
    title: "Business",
    price: 20,
    nProjects: 420,
    features: [
      { body: "feature 1", included: true },
      { body: "feature 2", included: true },
      { body: "feature 3", included: true },
      { body: "feature 4", included: true },
      { body: "feature 5", included: true },
    ],
  },
];

const Pricing = () => {
  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
      <GridItem colSpan={3}>
        <Center px={12}>
          <Text>
            Choose <b>annual billing</b> and get <b>2 months free</b>
          </Text>
        </Center>
      </GridItem>
      {pricingData.map((plan, index) => (
        <GridItem key={index}>
          <Center>
            <VStack gap={2}>
              <Heading size="md">{plan.title}</Heading>
              <Text fontWeight={600}>${plan.price}/mo</Text>
              <Text>Up to {plan.nProjects} projects</Text>
              {plan.features.map((feature, index) => (
                <HStack key={index} gap={2}>
                  {feature.included ? <FaCheck color="green" /> : <Box w={4} />}
                  <Text fontSize="sm" as={!feature.included ? "s" : undefined}>
                    {feature.body}
                  </Text>
                </HStack>
              ))}
              <Box />
              <Button>Start free trial</Button>
            </VStack>
          </Center>
        </GridItem>
      ))}
    </Grid>
  );
};

export default Pricing;

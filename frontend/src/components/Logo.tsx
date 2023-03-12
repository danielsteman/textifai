import { Icon, IconProps, Link, Text } from "@chakra-ui/react";

const Logo = (props: IconProps) => (
  <Link href="/">
    <Text fontSize="4xl" as='abbr' fontWeight={800}>🚀 SaaS</Text>
  </Link>
);

export default Logo;
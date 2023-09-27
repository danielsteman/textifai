import React, { KeyboardEvent } from 'react';
import { Tag, TagCloseButton, TagLabel, Input, Flex, useColorMode, Box, } from "@chakra-ui/react";
import theme from "../../app/themes/theme";

type TagInputProps = {
  tags?: string[];
  onAddTag: (tag: string) => void;
  onDeleteTag: (tag: string) => void;
};

const stringToHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char; 
    hash |= 0; 
  }
  return hash;
};

const getColorForTag = (tag: string, colorMode: string) => {
  const colors = [
    theme.colors[colorMode].onPrimary, 
    theme.colors[colorMode].onSecondary, 
    theme.colors[colorMode].onTertiary,
    theme.colors[colorMode].inverseOnSurface
  ];

  return colors[Math.abs(stringToHash(tag)) % colors.length];
};

const TagInput: React.FC<TagInputProps> = ({ tags = [], onAddTag, onDeleteTag }) => {
  const { colorMode } = useColorMode();

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && event.currentTarget.value) {
      onAddTag(event.currentTarget.value);
      event.currentTarget.value = "";
    }
  };

  return (
    <Flex direction="column" align="flex-start" justify="center" wrap="wrap">
      {tags.map((tag, index) => (
        <Box mb={2} key={index}>
          <Tag
            size="sm"
            borderRadius="full"
            variant="solid"
            bgColor={getColorForTag(tag, colorMode)}
            textColor={theme.colors[colorMode].onSurface}
          >
            <TagLabel>{tag}</TagLabel>
            <TagCloseButton onClick={() => onDeleteTag(tag)} />
          </Tag>
        </Box>
      ))}
      <Input
        placeholder={tags.length === 0 ? "Add a tag..." : ""}
        size="sm"
        onKeyDown={handleKeyDown}
        variant={tags.length === 0 ? "flushed" : "unstyled"}
        width="auto"
      />
    </Flex>
  );
};

export default TagInput;

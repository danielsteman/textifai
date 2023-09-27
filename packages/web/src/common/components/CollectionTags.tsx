import React, { FC, KeyboardEvent } from 'react';
import { Tag, TagCloseButton, TagLabel, Input, Flex, useColorMode } from "@chakra-ui/react";
import theme from "../../app/themes/theme";

type TagInputProps = {
  tags?: string[];
  onAddTag: (tag: string) => void;
  onDeleteTag: (tag: string) => void;
};

const getColorForTag = (tag: string, colorMode: string) => {
  const colors = [
      theme.colors[colorMode].onPrimary, 
      theme.colors[colorMode].onSecondary, 
      theme.colors[colorMode].onTertiary, 
      theme.colors[colorMode].onSurface, 
      theme.colors[colorMode].onSurfaceVariant, 
      theme.colors[colorMode].inverseOnSurface
    ]; 
  return colors[tag.charCodeAt(0) % colors.length];
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
          <Tag
            size="sm"
            key={index}
            borderRadius="full"
            variant="solid"
            bgColor={getColorForTag(tag, colorMode)}
          >
            <TagLabel>{tag}</TagLabel>
            <TagCloseButton onClick={() => onDeleteTag(tag)} />
          </Tag>
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

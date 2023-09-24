import { FC, KeyboardEvent } from 'react';
import { Box, Tag, TagCloseButton, TagLabel, Input } from "@chakra-ui/react";

type TagInputProps = {
  tags?: string[];
  onAddTag: (tag: string) => void;
  onDeleteTag: (tag: string) => void;
};

const TagInput: React.FC<TagInputProps> = ({ tags = [], onAddTag, onDeleteTag }) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && event.currentTarget.value) {
      onAddTag(event.currentTarget.value);
      event.currentTarget.value = "";
    }
  };

  return (
    <Box>
      {tags.map((tag, index) => (
        <Tag
          size="sm"
          key={index}
          borderRadius="full"
          variant="solid"
          m={1}
          bgColor="blue.500"
        >
          <TagLabel>{tag}</TagLabel>
          <TagCloseButton onClick={() => onDeleteTag(tag)} />
        </Tag>
      ))}
      <Input
        placeholder="Add a tag..."
        size="sm"
        onKeyDown={handleKeyDown}
        variant="flushed"
        width="auto"
      />
    </Box>
  );
};

export default TagInput;

import { FC, KeyboardEvent } from 'react';
import { Tag, TagCloseButton, TagLabel, Input, Flex } from "@chakra-ui/react";

type TagInputProps = {
  tags?: string[];
  onAddTag: (tag: string) => void;
  onDeleteTag: (tag: string) => void;
};

const getColorForTag = (tag: string) => {
  const colors = ["red.500", "blue.500", "green.500", "yellow.500", "purple.500", "pink.500"]; 
  return colors[tag.charCodeAt(0) % colors.length];
};

const TagInput: React.FC<TagInputProps> = ({ tags = [], onAddTag, onDeleteTag }) => {
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
            bgColor={getColorForTag(tag)}
          >
            <TagLabel>{tag}</TagLabel>
            <TagCloseButton onClick={() => onDeleteTag(tag)} />
          </Tag>
        ))}
        <Input
          placeholder={tags.length === 0 ? "Add a tag..." : ""}
          size="sm"
          onKeyDown={handleKeyDown}
          variant= {tags.length === 0 ? "flushed" : "unstyled"}
          width="auto"
        />
    </Flex>
  );
};

export default TagInput;







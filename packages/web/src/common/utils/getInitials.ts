export const getInitials = (name: string): string => {
  // Use a regular expression to match the first letter of each word
  const rgx = /(\b\p{L})/gu;
  const initialsMatches = name.match(rgx);

  // If there are matches, convert them to uppercase and join them
  if (initialsMatches) {
    const initials = initialsMatches
      .map((match) => match.toUpperCase())
      .join("");
    return initials;
  }

  // If no initials are found, return an empty string
  return "";
};

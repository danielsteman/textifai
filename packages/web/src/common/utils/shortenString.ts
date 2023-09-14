export const shortenString = (str: string, maxChars: number = 20) => {
  if (str.length <= maxChars) {
    return str;
  } else {
    return str.substring(0, maxChars - 3) + "...";
  }
};

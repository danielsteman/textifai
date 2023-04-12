// Format camelcase as capitalized words

export default function formatPropString(stringProp: string) {
  var temp = stringProp.slice(1).replace(/([A-Z])/g, " $1");
  var formattedStringProp = stringProp.charAt(0).toUpperCase() + temp
  return formattedStringProp
};
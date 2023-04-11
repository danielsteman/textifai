export default function formatPropString(stringProp: string) {
  var formattedStringProp = ""
  formattedStringProp += stringProp[0].toUpperCase()
  formattedStringProp += stringProp.slice(1).replace("upper case char", "space and lowercase char")
  return formattedStringProp
};

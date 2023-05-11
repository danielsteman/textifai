// Format camelcase as capitalized words

export function formatPropString(stringProp: string) {
  var temp = stringProp.slice(1).replace(/([A-Z])/g, " $1");
  var formattedStringProp = stringProp.charAt(0).toUpperCase() + temp;
  return formattedStringProp;
}

// Format string like "Product 1" as route like "product1"

export function formatStringAsRoute(s: string) {
  return s.toLowerCase().replace(/\s+/g, "");
}

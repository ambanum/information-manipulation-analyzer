export const sanitizeText = (text: string) =>
  text
    // replace all accents with plain
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[æ]/g, 'ae')
    .replace(/[ç]/g, 'c')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[ñ]/g, 'n')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[œ]/g, 'oe')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ýÿ]/g, 'y')
    // replace all non text characters in any alphabet
    .replace(/[^\p{L}\d_]/gimu, '')
    .toLowerCase();

export const sanitizeUrl = (url: string) =>
  url
    // replace all not authorized characters in url
    .replace(/[^-A-Za-z0-9+&@#\/%?=~_|!:,.;\(\)]/gi, '')
    .toLowerCase();

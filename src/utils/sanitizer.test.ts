import { sanitizeText, sanitizeUrl, sanitizeWord } from './sanitizer';

const wordTests = [
  ['<SCRIPT SRC=http://xss.rocks/xss.js></SCRIPT>', 'scriptsrchttpxssrocksxssjsscript'],
  ['<IMG SRC="javascript:alert(\'XSS\');">', 'imgsrcjavascriptalertxss'],
  ['javascript:alert("ok")', 'javascriptalertok'],
  [
    'perl -e \'print "<IMG SRC=java\0script:alert("XSS")>";\' > out',
    'perleprintimgsrcjavascriptalertxssout',
  ],
  ['Set.constructor`alert\x28document.domain\x29', 'setconstructoralertdocumentdomain'],
  ['ok', 'ok'],
  ['ok129', 'ok129'],
  ['Super', 'super'],
  ['मस्जिद', 'मस्जिद'],
  ['फ्रांस', 'फ्रांस'],
  ['فرنسا_الإرهابية', 'فرنسا_الإرهابية'],
  ['Xoроший', 'xoроший'],
];

const textTests = [
  ['<SCRIPT SRC=http://xss.rocks/xss.js></SCRIPT>', 'script srchttpxssrocksxssjsscript'],
  ['<IMG SRC="javascript:alert(\'XSS\');">', 'img src"javascriptalertxss"'],
  ['javascript:alert("ok")', 'javascriptalert"ok"'],
  [
    'perl -e \'print "<IMG SRC=java\0script:alert("XSS")>";\' > out',
    'perl e print "img srcjavascriptalert"xss""  out',
  ],
  ['Set.constructor`alert\x28document.domain\x29', 'setconstructoralertdocumentdomain'],
  ['une recherche fructueuse', 'une recherche fructueuse'],
  ['"primum non nocere"', '"primum non nocere"'],
];

const urls = [
  [
    'http://servername/index.php?search="><script>alert(0)</script>',
    'http://servername/index.php?search=scriptalert(0)/script',
  ],
  [
    'https://www.lemonde.fr/international/article/2021/08/17/apres-la-chute-de-kaboul-aux-mains-des-talibans-la-crainte-d-une-onde-de-choc-regionale_6091619_3210.html',
    'https://www.lemonde.fr/international/article/2021/08/17/apres-la-chute-de-kaboul-aux-mains-des-talibans-la-crainte-d-une-onde-de-choc-regionale_6091619_3210.html',
  ],
];

test('any word', () => {
  wordTests.forEach(([name, sanitizedName]) => expect(sanitizeWord(name)).toBe(sanitizedName));
});
test('any text', () => {
  textTests.forEach(([name, sanitizedName]) => expect(sanitizeText(name)).toBe(sanitizedName));
});
test('urls', () => {
  urls.forEach(([name, sanitizedName]) => expect(sanitizeUrl(name)).toBe(sanitizedName));
});

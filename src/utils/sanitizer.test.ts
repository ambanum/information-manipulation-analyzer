import { sanitizeText, sanitizeUrl } from './sanitizer';

const hashtagTests = [
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
  ['فرنسا_الإرهابية', 'فرنسا_الإرهابية'],
  ['Xoроший', 'xoроший'],
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

test('any text', () => {
  hashtagTests.forEach(([name, sanitizedName]) => expect(sanitizeText(name)).toBe(sanitizedName));
});
test('urls', () => {
  urls.forEach(([name, sanitizedName]) => expect(sanitizeUrl(name)).toBe(sanitizedName));
});

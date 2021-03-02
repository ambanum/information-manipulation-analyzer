console.log(''); // eslint-disable-line
console.log('╔════START════════════════════════════════════════════════════'); // eslint-disable-line
console.log(process.env); // eslint-disable-line
console.log(process.env.BASE_PATH); // eslint-disable-line
console.log({
  basePath: process.env.BASE_PATH,
}); // eslint-disable-line
console.log('╚════END══════════════════════════════════════════════════════'); // eslint-disable-line
module.exports = {
  basePath: process.env.BASE_PATH,
};

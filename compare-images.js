// const fetch = require("node-fetch")
// const axios = require("axios")
// // const looksSame = require("looks-same")
// const pixelmatch = require("pixelmatch")
// const fs = require("fs")
// const images = [
//     "https://pbs.twimg.com/media/FE3nt84WYAM9Svv?format=jpg&name=small",
//     "https://pbs.twimg.com/media/FEz4pHhXsAYEAZ6?format=jpg&name=small"
// ]
// const imagesLocal = [
//     "FE3nt84WYAM9Svv.jpeg",
//     "FEz4pHhXsAYEAZ6.jpeg"
// ]
// const PNG = require('pngjs').PNG;


// // function getBase64(url) {
// //     return axios
// //       .get(url, {
// //         responseType: 'arraybuffer'
// //       })
// //       .then(response => Buffer.from(response.data, 'binary').toString('base64'))
// //   }

const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');

const img1 = PNG.sync.read(fs.readFileSync('1.png'));
const img2 = PNG.sync.read(fs.readFileSync('2.png'));
const img3 = PNG.sync.read(fs.readFileSync('3.png'));
const img4 = PNG.sync.read(fs.readFileSync('4.png'));
const {width, height} = img1;
const {width: width2, height: height2} = img3;
const diff1 = new PNG({width, height});
const diff2 = new PNG({width: width2, height: height2});
console.log('');//eslint-disable-line
console.log('╔════START════════════════════════════════════════════════════');//eslint-disable-line
console.log(img1, img2, width, height);//eslint-disable-line
console.log();//eslint-disable-line
console.log(img3, img4, width2, height2);//eslint-disable-line
console.log('╚════END══════════════════════════════════════════════════════');//eslint-disable-line

const t1 = pixelmatch(img1.data, img2.data, diff1.data, width, height, {threshold: 0.2});
const t2 = pixelmatch(img3.data, img4.data, diff2.data, width2, height2, {threshold: 0.2});
console.log(" ")
console.log("t1",t1)
console.log("t2",t2)
fs.writeFileSync('diff1.png', PNG.sync.write(diff1));
fs.writeFileSync('diff2.png', PNG.sync.write(diff2));

// const main = async () => {
//     const image1 = PNG.sync.read(fs.readFileSync('1.png'));
//     const image2 = PNG.sync.read(fs.readFileSync('2.png'));
//     const {width, height} = image1;
//     const diff = new PNG({width, height});
//     console.log('');//eslint-disable-line
//     console.log('╔════START════════════════════════════════════════════════════');//eslint-disable-line
//     console.log(image1.data,image2.data, diff);
//     const numDiffPixels = pixelmatch(image1.data,image2.data, diff, 556, 680, {threshold: 0.1});
//     console.log(numDiffPixels);//eslint-disable-line
//     console.log('╚════END══════════════════════════════════════════════════════');//eslint-disable-line
    
// }
// const main = async () => {
//     looksSame(imagesLocal[0], imagesLocal[1], {tolerance: 100}, function(error, {equal}) {
//         // equal will be true, if images looks the same
//         console.log('');//eslint-disable-line
//         console.log('╔════START══equal══════════════════════════════════════════════════');//eslint-disable-line
//         console.log(equal);//eslint-disable-line
//         console.log('╚════END════equal══════════════════════════════════════════════════');//eslint-disable-line
        
//     });
//     looksSame.createDiff({
//         reference: `${imagesLocal[0]}`,
//         current: `${imagesLocal[1]}`,
//         diff: 'to.png',
//         highlightColor: '#ff00ff', // color to highlight the differences
//         strict: false, // strict comparsion
//         tolerance: 2.5,
//         antialiasingTolerance: 0,
//         ignoreAntialiasing: true, // ignore antialising by default
//         ignoreCaret: true // ignore caret by default
//     }, function(error) {
//         console.log('');//eslint-disable-line
//         console.log('╔════START══error══════════════════════════════════════════════════');//eslint-disable-line
//         console.log(error);//eslint-disable-line
//         console.log('╚════END════error══════════════════════════════════════════════════');//eslint-disable-line
        
//     });
//     // const results = await Promise.all(images.map(async image => {
//     //     let res = await axios
//     //     .get(image, {
//     //       responseType: 'arraybuffer'
//     //     });
//     //     console.log('');//eslint-disable-line
//     //     console.log('╔════START════════════════════════════════════════════════════');//eslint-disable-line
//     //     console.log(res);
//     //     console.log('╚════END══════════════════════════════════════════════════════');//eslint-disable-line
        
//     //     return res;
//     // }))
//     // console.log(results[0].substring(0, 100));
//     // console.log(results[1].substring(0, 100));
//     // console.log(results[0] === results[1]);
// }

// main()
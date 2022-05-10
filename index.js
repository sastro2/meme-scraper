import fs from 'node:fs';
import fetch from 'node-fetch';

const websiteURL = 'https://memegen-link-examples-upleveled.netlify.app/';
const dirpath = 'memes';

const replaceNewLines = (textToReplace) =>
  textToReplace.replace(/(?:\r\n|\r|\n)/g, '');

const transformMatchToURL = (textToReplace) =>
  textToReplace.replace(/(?: |<img|src=|"|>)/g, '');

console.log(`Downloading top 10 memes from ${websiteURL}`);
const response = await fetch(websiteURL);
const imgList = [];
const body = await response.text();
const bodyWithoutNewLines = replaceNewLines(body);

await fs.promises.mkdir(dirpath, { recursive: true });

const regex = /<img[^>]+src\s*=\s*['"]([^'"]+)['"][^>]*>/g;
const result = bodyWithoutNewLines.match(regex).slice(0, 10);
result.forEach((element) => imgList.push(transformMatchToURL(element)));

for (let index = 0; index < imgList.length; index++) {
  const filename = index < 9 ? `0${index + 1}` : index + 1;
  const imgResponse = await fetch(imgList[index]);
  imgResponse.body.pipe(
    fs.createWriteStream(dirpath + '/' + filename + '.jpg'),
  );
  const dots = '.'.repeat(index);
  const left = imgList.length - 1 - index;
  const empty = ' '.repeat(left);
  process.stdout.write(`\r[${dots}${empty}] ${(index + 1) * 10}%`);
  if (index === imgList.length - 1) {
    console.log(' ');
    console.log('Download complete');
  }
}

const fs = require('fs');
const path = require('path');

const libFolder = './lib';

if (!fs.existsSync(libFolder)){
  console.log("No dir ",libFolder);
  return;
}

const result = walk(libFolder)
    .filter(file => file.endsWith('.js'))
    .reduce(
        (res, file) => res += `export * from '${file.replace(/.js/, '')}';\n`,
        '',
    );

fs.writeFile('index.js', result, (err) => {

  if (err) {
    return console.log(err);
  }

  console.log('Proto build success!');
});

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    var stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      /* Recurse into a subdirectory */
      results = results.concat(walk(file));
    } else {
      /* Is a file */
      results.push(file);
    }
  });
  return results;
}

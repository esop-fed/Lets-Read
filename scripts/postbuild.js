/**
 * execute after npm run build
 */
const fs = require('fs');
const pJson = require('../dist/package.json');

const clientVersion = pJson.version.replace(/(.*)\./, '$1');
const oldName = `./release/win-ia32/IMS-${clientVersion}-full.nupkg`;
const newName = `./release/win-ia32/IMS-${clientVersion}-ia32-full.nupkg`;

fs.rename(oldName, newName, (err) => {
  if (err) throw err;
  console.log('Rename', oldName, 'to', newName);
});

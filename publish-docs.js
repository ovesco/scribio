/* eslint-disable */
const { exec } = require('child_process');
const path = require('path');
const ghpages = require('gh-pages');

console.log('Running build script');
exec('npm run build-docs', (err) => {
  if (err !== null) {
    console.error(err);
  } else {
    console.log('Running gh-pages');
    ghpages.publish(path.join(__dirname, 'docs', 'dist'), (err) => {
      if (err) console.error(err);
      else console.log('Done publishing docs website!');
    });
  }
});

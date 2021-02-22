// https://github.com/shelljs/shelljs#command-reference
// https://devhints.io/shelljs
// https://github.com/shelljs/shelljs/wiki/The-make-utility
require('shelljs/make');

config.fatal = true;
config.verbose = true;

const readline = require('readline');
const { execFileSync } = require('child_process');

const packageJson = require('./package.json');

target.all = () => {
  target.clean();
  target.lint();
  target.compileTS();
};

target.afmToJson = () => {
  target.clean();
  exec('ts-node scripts/fonts/parse.ts');
};

target.encodingsToJson = () => {
  target.clean();
  exec('ts-node scripts/encodings/parse.ts');
};

target.lint = () => {
  exec(`prettier --loglevel error --write "{src,scripts}/**/*.ts"`);
  exec('tslint --project ./tsconfig.json --fix "{src,scripts}/**/*.ts"');
};

target.clean = () => {
  rm('-rf', 'lib');
  rm('-rf', 'es');
  rm('-rf', 'dist');
  rm('-f', 'encoding_metrics/*.json', 'font_metrics/*.json', 'src/*.json');
};

target.compileTS = () => {
  target.clean();
  target.afmToJson();
  target.encodingsToJson();
  exec('tsc --module CommonJS --outDir lib');
};

/* =============================== Release ================================== */

target.release = () => {
  target.all();
  const tag = `v${packageJson.version}`;
  console.log('Releasing version', tag);
  execFileSync('git', ['tag', tag]);
  execFileSync('git', ['push', '--tags']);

  execFileSync('yarn', ['publish'], {
    stdio: 'inherit',
  });

  console.log('🎉   Release of', tag, 'complete! 🎉');
};

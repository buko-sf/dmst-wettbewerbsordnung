const fs = require('fs');
const marked = require('marked');

function run() {
  if (!fs.existsSync('output')) {
    fs.mkdirSync('output');
  }

  let template = fs.readFileSync('template.html', 'utf8');
  let markdown = fs.readFileSync('README.md', 'utf8');
  let html = template.replace('$$CONTENT$$', marked(markdown));
  fs.writeFileSync('output/rules.html', html, 'utf8');

  let styles = fs.readFileSync('styles.css', 'utf8');
  let normalize = fs.readFileSync(require.resolve('normalize.css'), 'utf8');
  fs.writeFileSync('output/styles.css', normalize + styles, 'utf8');

  fs.copyFileSync('logo.jpg', 'output/logo.jpg');
}

run();

if (process.argv.includes('--watch')) {
  setInterval(run, 1000);
}

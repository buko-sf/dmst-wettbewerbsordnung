const fs = require('fs');
const url = require('url');
const marked = require('marked');
const puppeteer = require('puppeteer');

function build_html() {
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

async function run() {
  let browser = await puppeteer.launch();
  try {
    let page = await browser.newPage();

    async function build() {
      build_html();
      await page.goto(url.pathToFileURL('output/rules.html'), { waitUntil: 'networkidle0' });
      await page.pdf({ path: 'output/rules.pdf', preferCSSPageSize: true });
    }

    await build();

    if (process.argv.includes('--watch')) {
      while (true) {
        await timeout(1000);
        await build();
      }
    }
  } finally {
    await browser.close();
  }
}

function timeout(delay) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

run().catch(error => {
  console.error(error);
});

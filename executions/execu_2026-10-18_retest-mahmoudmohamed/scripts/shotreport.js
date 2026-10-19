const path = require('path'); const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
(async () => { const b = await chromium.launch({ headless: true, channel: 'msedge', args: ['--disable-gpu'] }); const pg = await b.newPage({ viewport: { width: 1280, height: 1500 } });
await pg.goto(require('url').pathToFileURL(path.join(__dirname, '..', 'report.html')).href); await pg.waitForTimeout(1500);
await pg.screenshot({ path: process.argv[2] }); await b.close(); console.log('ok'); })();

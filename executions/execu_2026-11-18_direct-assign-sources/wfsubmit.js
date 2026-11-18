const path = require('path'), fs = require('fs'); const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
const KEY = fs.readFileSync('C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/3d6c9864-52e6-4e9d-95a9-14042dfac39c/scratchpad/wf-key.txt', 'utf8').trim();
(async () => {
  const b = await chromium.launch({ headless: true, channel: 'msedge' }); const pg = await (await b.newContext({ viewport: { width: 1000, height: 1000 } })).newPage();
  const res = []; pg.on('response', r => { if (/submit|submission|feedback\/api|web-forms/i.test(r.url())) res.push(r.status() + ' ' + r.url().replace(/key=[^&]+/, 'key=<k>').replace(/fw1\.[A-Za-z0-9._-]+/, '<k>').slice(0, 120)); });
  const SH = fs.readFileSync('C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/3d6c9864-52e6-4e9d-95a9-14042dfac39c/scratchpad/wf-share.txt', 'utf8').trim(); await pg.goto(SH, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await pg.waitForTimeout(8000);
  const shot = n => pg.screenshot({ path: P + '/executions/execu_2026-11-18_direct-assign-sources/out/' + n });
  await shot('wf-1-open.png'); const inputs = await pg.$$eval('input,textarea', es => es.map(e => (e.name || e.id || e.placeholder || e.type) + ':' + e.type));
  console.log('inputs', JSON.stringify(inputs));
  const fill = async (re, v) => { const l = pg.getByLabel(re).first(); if (await l.count()) { await l.fill(v); return 1; } return 0; };
  console.log('fill', await fill(/last name|name/i, 'QA RT22 Webform'), await fill(/email/i, 'qa-rt22-import@example.com'), await fill(/subject/i, 'QA RT22 DA webform (TAVI)'));
  await shot('wf-2-filled.png');
  await pg.getByRole('button', { name: /submit|send/i }).first().click().catch(e => console.log('noSubmit', e.message.split('\n')[0]));
  await pg.waitForTimeout(8000); await shot('wf-3-after.png');
  console.log('after', (await pg.innerText('body')).replace(/\s+/g, ' ').slice(0, 300)); console.log('res', JSON.stringify(res));
  await b.close();
})().catch(e => console.log('ERR', e.message.split('\n')[0]));

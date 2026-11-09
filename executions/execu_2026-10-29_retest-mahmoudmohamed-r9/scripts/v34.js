const out = {}; const bad = []; page.on('response', r => { if (r.url().includes('/api/') && r.status() >= 400) bad.push(r.status() + ' ' + r.request().method() + ' ' + r.url().replace(API, '').slice(0, 80)); });
await page.getByText('Files', { exact: true }).first().click(); await sleep(6000); await shot('v34-files-empty');
out.filesTab = (await txt()).split('\n').map(l => l.trim()).filter(l => /Upload|file|File|No files|Drop/i.test(l)).slice(0, 10);
const input = page.locator('input[type=file]'); out.inputs = await input.count(); const dir = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-27_retest-mahmoudmohamed-r8/files/';
const files = Array.from({ length: 15 }, (_, i) => dir + 'QA RT r8 file ' + String(i + 1).padStart(2, '0') + '.png');
let idx = -1; for (let i = 0; i < out.inputs; i++) { const acc = await input.nth(i).getAttribute('accept'); const vis = await input.nth(i).evaluate(e => !!e.closest('[role=tabpanel],main')); if (!/image\/\*$/.test(acc || '') || vis) { idx = i; } } out.idx = idx;
if (idx >= 0) { const multi = await input.nth(idx).evaluate(e => e.multiple); out.multiple = multi; if (multi) { await input.nth(idx).setInputFiles(files); await sleep(30000); } else { for (const f of files) { await page.locator('input[type=file]').nth(idx).setInputFiles(f); await sleep(4000); } } }
await sleep(4000); await shot('v34-files-15');
const t = (await txt()).split('\n'); out.listed = t.filter(l => /QA RT r8 file \d\d/.test(l)).length;
out.scroll = await page.evaluate(() => { const s = [...document.querySelectorAll('*')].filter(x => x.scrollHeight > x.clientHeight + 10 && /auto|scroll/.test(getComputedStyle(x).overflowY) && /QA RT r8 file/.test(x.innerText)); return s.map(x => x.clientHeight + '/' + x.scrollHeight).slice(0, 3); });
out.pageScroll = await page.evaluate(() => document.scrollingElement.scrollHeight); out.bad = bad.slice(0, 6);
return done(out);

const o = {}; const G2 = '7326ffa9-27c8-41f7-b8dc-35fb64c40e07';
await page.goto(H + '/views/all/tickets/' + G2, { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 60; i++) { await sleep(3000); const t = await text(); if (/g2 admin-owned/.test(t) && /QA alt/.test(t)) break; } await sleep(3000);
await page.getByRole('button', { name: /QA alt/ }).first().click(); await sleep(4000);
await page.getByRole('button', { name: /Add department/ }).first().click(); await sleep(2500);
await shot('2754-a3-agent-add-department.png');
o.opts = await page.getByRole('option').evaluateAll(a => a.map(e => e.innerText.trim().replace(/\s+/g, ' ')).filter(x => /QA RT14/.test(x)).slice(0, 10));
const srch = page.locator('input[placeholder*="earch" i]').last(); if (await srch.count()) { await srch.fill('QA RT14 2754'); await sleep(2000); o.optsSearch = await page.getByRole('option').evaluateAll(a => a.map(e => e.innerText.trim().replace(/\s+/g, ' ')).slice(0, 10)); await shot('2754-a3b-agent-dept-search.png'); }
const optB = page.getByRole('option', { name: /QA RT14 2754 Dept B/ }).first(); o.optB = await optB.count();
if (!o.optB) { const tB = page.getByText('QA RT14 2754 Dept B', { exact: true }).last(); o.textB = await tB.count(); if (o.textB) await tB.click(); } else await optB.click();
await sleep(2500); await page.keyboard.press('Escape').catch(() => {}); await sleep(800);
await shot('2754-a4-agent-share-filled.png'); o.panel = ((await text()).match(/QA alt[\s\S]{0,400}/g) || []).slice(-1)[0]?.replace(/\s+/g, ' ');
const runBtn = page.getByRole('button', { name: /^Run$/ }).last(); o.runEnabled = await runBtn.isEnabled().catch(() => null);
if (o.runEnabled) { await runBtn.click(); await sleep(8000); await shot('2754-a5-agent-after-run.png'); o.after = ((await text()).replace(/\s+/g, ' ').match(/.{0,200}(not available|Closed|permission|error|failed|not allowed).{0,200}/i) || [''])[0]; }
return o;

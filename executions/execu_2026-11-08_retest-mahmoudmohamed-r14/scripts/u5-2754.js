const o = { net: [] }; page.on('response', async r => { const u = r.url(); if (u.includes('/api/v1') && !u.includes('/iam/auth') && r.request().method() !== 'GET') o.net.push(r.status() + ' ' + r.request().method() + ' ' + u.split('/api/v1')[1].slice(0, 140) + ' REQ ' + (r.request().postData() || '').slice(0, 500) + ' RES ' + (await r.text().catch(() => '')).slice(0, 400)); }); const G2 = '7326ffa9-27c8-41f7-b8dc-35fb64c40e07';
await page.goto(H + '/views/all/tickets/' + G2, { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 60; i++) { await sleep(3000); const t = await text(); if (/g2 admin-owned/.test(t) && /QA alt/.test(t)) break; } await sleep(3000);
await page.getByRole('button', { name: /QA alt/ }).first().click(); await sleep(4000);
await page.getByRole('button', { name: /Add department/ }).first().click(); await sleep(2500);
await page.getByText('Choose a department', { exact: true }).last().click(); await sleep(2500);
const srch = page.locator('input[placeholder*="earch" i]:visible').last(); o.search = await srch.count(); if (o.search) { await srch.fill('QA RT14 2754'); await sleep(2500); }
o.offered = await page.getByRole('option').evaluateAll(a => a.map(e => e.innerText.trim().replace(/\s+/g, ' ')).slice(0, 12));
if (!o.offered.length) o.offeredText = ((await text()).match(/QA RT14 2754 Dept [AB]/g) || []);
await shot('2754-b4-agent-dept-picker.png');
const optB = page.getByRole('option', { name: /QA RT14 2754 Dept B/ }).first(); o.optB = await optB.count();
if (o.optB) await optB.click(); else { const tB = page.getByText('QA RT14 2754 Dept B', { exact: true }).last(); o.textB = await tB.count(); if (o.textB) await tB.click(); }
await sleep(2500); await shot('2754-b5-agent-share-filled.png');
const runBtn = page.getByRole('button', { name: /^Run$/ }).last(); o.runEnabled = await runBtn.isEnabled().catch(() => null);
if (o.runEnabled) { await runBtn.click(); await sleep(9000); await shot('2754-b6-agent-after-run.png'); o.after = ((await text()).replace(/\s+/g, ' ').match(/.{0,200}(not available|Closed|permission|error|failed|not allowed).{0,200}/i) || [''])[0]; }
return o;

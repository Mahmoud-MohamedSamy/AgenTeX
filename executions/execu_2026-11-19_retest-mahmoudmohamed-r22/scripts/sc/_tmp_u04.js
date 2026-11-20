const fs = require('fs'); const RUN = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20';
const I = JSON.parse(fs.readFileSync(RUN + '/out/ids-sc.json', 'utf8')); const MID = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const LED = m => fs.appendFileSync(RUN + '/ledger.md', '- ' + new Date().toISOString().slice(0, 19) + ' [SC] ' + m + '\n');
const signedOut = async () => (await page.getByText('Forgot password?').count()) > 0;
const bodyText = async () => (await page.innerText('body')).replace(/\s+/g, ' ');
const box = async loc => { const b = await loc.first().boundingBox().catch(() => null); return b ? [Math.round(b.x), Math.round(b.y), Math.round(b.x + b.width), Math.round(b.y + b.height)] : null; };
const go = async (p, w = 7000) => { await page.goto(H + p, { waitUntil: 'domcontentloaded' }); await sleep(w); if (await signedOut()) throw new Error('SIGNED_OUT'); };
const out = { req: [] };
page.on('request', r => { const u = r.url(); if (/\/records\?/.test(u) && /api\/v1/.test(u)) out.req.push(u.replace(/.*\/api\/v1/, '').replace(/[0-9a-f-]{36}/g, '{id}').slice(0, 400)); });
await go('/modules/' + MID, 9000);
const srch = page.locator('main input[type=search], main input[placeholder*="Search" i]').first(); out.search = await srch.count();
if (out.search) { await srch.fill('QA RT20 SC'); await page.keyboard.press('Enter'); await sleep(4000); }
const rowsTxt = async () => (await page.locator('tbody tr').allInnerTexts()).map(s => s.replace(/\s+/g, ' ').slice(0, 120)).slice(0, 9);
out.rows0 = await rowsTxt();
const sb = page.getByRole('button', { name: 'Sort by Score' });
await sb.click(); await sleep(3500); out.sortA = await rowsTxt(); await shot('1483-10-sort-score-1.png');
await sb.click(); await sleep(3500); out.sortB = await rowsTxt(); await shot('1483-11-sort-score-2.png');
await page.getByRole('button', { name: 'Open filter sidebar' }).first().click(); await sleep(1500);
const side = page.locator('aside, [role=complementary], [role=dialog]').filter({ hasText: /Filter/i }).last();
const si = side.locator('input').first(); if (await si.count()) { await si.fill('Score'); await sleep(1000); }
const cb = side.getByText(/^Score$/).first(); out.scoreInFilter = await cb.count(); if (out.scoreInFilter) { await cb.click(); await sleep(1200); }
out.panel = (await side.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 500);
const sel = side.locator('select').filter({ has: page.locator('option[value=greater_than_or_equal_to]') }).first();
if (await sel.count()) { await sel.selectOption('greater_than_or_equal_to'); await sleep(600); const inp = side.locator('input[type=number], input[inputmode=numeric], input').last(); await inp.fill('30'); await sleep(400); const ap = side.getByRole('button', { name: /Apply|Search|Filter/ }).last(); if (await ap.count()) await ap.click(); else await page.keyboard.press('Enter'); await sleep(4500); out.filtered = await rowsTxt(); }
else out.selOpts = await side.locator('select option').allInnerTexts().catch(() => []);
await shot('1483-12-filter-score.png');
return out;

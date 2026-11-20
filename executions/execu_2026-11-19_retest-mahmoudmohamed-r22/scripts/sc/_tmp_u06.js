const fs = require('fs'); const RUN = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20';
const I = JSON.parse(fs.readFileSync(RUN + '/out/ids-sc.json', 'utf8')); const MID = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const LED = m => fs.appendFileSync(RUN + '/ledger.md', '- ' + new Date().toISOString().slice(0, 19) + ' [SC] ' + m + '\n');
const signedOut = async () => (await page.getByText('Forgot password?').count()) > 0;
const bodyText = async () => (await page.innerText('body')).replace(/\s+/g, ' ');
const box = async loc => { const b = await loc.first().boundingBox().catch(() => null); return b ? [Math.round(b.x), Math.round(b.y), Math.round(b.x + b.width), Math.round(b.y + b.height)] : null; };
const go = async (p, w = 7000) => { await page.goto(H + p, { waitUntil: 'domcontentloaded' }); await sleep(w); if (await signedOut()) throw new Error('SIGNED_OUT'); };
const out = { req: [] };
page.on('request', r => { if (/views/.test(r.url()) && r.method() !== 'GET') out.req.push(r.method() + ' ' + r.url().replace(/.*\/api\/v1/, '') + ' ' + (r.postData() || '').slice(0, 700)); });
page.on('response', r => { if (/views/.test(r.url()) && r.request().method() !== 'GET') out.req.push('<- ' + r.status()); });
await go('/modules/' + MID, 9000);
await page.getByRole('button', { name: 'Custom views' }).first().click(); await sleep(1200);
await page.getByText(/New custom view/i).first().click(); await sleep(3000);
await page.getByPlaceholder('Enter custom view name').fill('QA RT20 SC hot leads');
await page.getByText('Filter by criteria').click(); await sleep(1500);
const sec = page.locator('section, div').filter({ hasText: /^Specify criteria/ }).first();
out.critControls = await page.locator('main select, main [role=combobox], main button').evaluateAll(e => e.map(x => (x.getAttribute('aria-label') || '') + '|' + (x.innerText || '').slice(0, 25)).filter(s => s.length > 1)).then(a => a.slice(0, 30));
// field picker: first combobox / select in criteria
const fsel = page.locator('main select').first();
if (await fsel.count()) { out.fieldOpts = (await fsel.locator('option').allInnerTexts()).filter(x => /score/i.test(x)); }
const cbx = page.locator('main [role=combobox]').first();
if (!out.fieldOpts && await cbx.count()) { await cbx.click(); await sleep(800); await page.keyboard.type('Score'); await sleep(800); out.fieldOpts = await page.locator('[role=option]').allInnerTexts(); }
await shot('1483-15-view-criteria.png');
return out;

const fs = require('fs'); const RUN = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20';
const I = JSON.parse(fs.readFileSync(RUN + '/out/ids-sc.json', 'utf8')); const MID = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const LED = m => fs.appendFileSync(RUN + '/ledger.md', '- ' + new Date().toISOString().slice(0, 19) + ' [SC] ' + m + '\n');
const signedOut = async () => (await page.getByText('Forgot password?').count()) > 0;
const bodyText = async () => (await page.innerText('body')).replace(/\s+/g, ' ');
const box = async loc => { const b = await loc.first().boundingBox().catch(() => null); return b ? [Math.round(b.x), Math.round(b.y), Math.round(b.x + b.width), Math.round(b.y + b.height)] : null; };
const go = async (p, w = 7000) => { await page.goto(H + p, { waitUntil: 'domcontentloaded' }); await sleep(w); if (await signedOut()) throw new Error('SIGNED_OUT'); };
const out = { req: [] };
page.on('request', r => { const u = r.url(); if (/\/records(\?|$|\/query)/.test(u) && /api\/v1/.test(u)) out.req.push(r.method() + ' ' + u.replace(/.*\/api\/v1/, '').slice(0, 300) + (r.postData() ? ' BODY ' + r.postData().slice(0, 300) : '')); });
await go('/settings/automation/scoring-rules?module=' + MID, 9000);
const s = page.getByRole('searchbox').or(page.getByPlaceholder(/Search/i)).first(); if (await s.count()) { await s.fill('QA RT20 SC'); await sleep(1500); }
out.list = (await page.locator('main').innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 900);
await shot('1483-1-rules-list.png');
const row = page.locator('tbody tr').filter({ hasText: 'QA RT20 SC R1 fit' }).first(); out.rowBox = await box(row);
await row.getByText('QA RT20 SC R1 fit').first().click(); await sleep(2500);
const dr = page.getByTestId('scoring-rule-drawer'); out.drawer = (await dr.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 1200);
await shot('1483-2-rule-editor.png');
await page.keyboard.press('Escape'); await sleep(800);
const r4 = page.locator('tbody tr').filter({ hasText: 'QA RT20 SC R4 dates' }).first(); await r4.getByText('QA RT20 SC R4 dates').first().click(); await sleep(2500);
out.drawer4 = (await page.getByTestId('scoring-rule-drawer').innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 1400);
await shot('1483-3-rule-dates.png');
await page.keyboard.press('Escape'); await sleep(800);
// leads list
await go('/modules/' + MID, 9000);
const ls = page.getByPlaceholder(/Search/i).first(); if (await ls.count()) { await ls.fill('QA RT20 SC'); await page.keyboard.press('Enter'); await sleep(4000); }
out.headers = (await page.locator('th, [role=columnheader]').allInnerTexts()).map(s => s.trim()).filter(Boolean).join('|');
out.rows = (await page.locator('tbody tr').allInnerTexts()).map(s => s.replace(/\s+/g, ' ').slice(0, 140));
out.buttons = (await page.locator('main button[aria-label]').evaluateAll(e => e.map(x => x.getAttribute('aria-label')))).slice(0, 40);
await shot('1483-4-leads-list.png');
return out;

const fs = require('fs'); const RUN = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20';
const I = JSON.parse(fs.readFileSync(RUN + '/out/ids-sc.json', 'utf8')); const MID = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const LED = m => fs.appendFileSync(RUN + '/ledger.md', '- ' + new Date().toISOString().slice(0, 19) + ' [SC] ' + m + '\n');
const signedOut = async () => (await page.getByText('Forgot password?').count()) > 0;
const bodyText = async () => (await page.innerText('body')).replace(/\s+/g, ' ');
const box = async loc => { const b = await loc.first().boundingBox().catch(() => null); return b ? [Math.round(b.x), Math.round(b.y), Math.round(b.x + b.width), Math.round(b.y + b.height)] : null; };
const go = async (p, w = 7000) => { await page.goto(H + p, { waitUntil: 'domcontentloaded' }); await sleep(w); if (await signedOut()) throw new Error('SIGNED_OUT'); };
const out = {};
await go('/settings/security/audit-log', 9000);
await page.getByText('All Entities', { exact: true }).first().click().catch(() => {}); await sleep(1000);
const opt = page.getByText(/^Scoring Rule/).first(); out.opt = await opt.count();
if (out.opt) { await opt.click(); await sleep(800); await page.keyboard.press('Escape'); await sleep(3500); }
const t = await bodyText(); out.lines = (t.match(/ndc-staging-owner (created|updated|deleted) QA RT20 SC[^]{0,140}?(IP|ago|AM|PM)/g) || []).slice(0, 12);
const el = page.getByText(/updated QA RT20 SC R1 fit/).first(); out.found = await el.count();
if (out.found) { await el.scrollIntoViewIfNeeded(); await sleep(500); }
await shot('1483-20-audit.png');
if (out.found) { await el.click(); await sleep(2000); out.detail = ((await bodyText()).match(/.{0,100}points.{0,300}/) || [''])[0]; await shot('1483-21-audit-detail.png'); }
return out;

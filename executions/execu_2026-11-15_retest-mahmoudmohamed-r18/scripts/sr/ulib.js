const fs = require('fs'); const RUN = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-15_retest-mahmoudmohamed-r18';
const I = JSON.parse(fs.readFileSync(RUN + '/out/ids-sr18.json', 'utf8')); const MID = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const LED = m => fs.appendFileSync(RUN + '/ledger.md', '- ' + new Date().toISOString().slice(0, 19) + ' ' + m + '\n');
const signedOut = async () => (await page.getByText('Forgot password?').count()) > 0;
const bodyText = async () => (await page.innerText('body')).replace(/\s+/g, ' ');
const box = async loc => { const b = await loc.first().boundingBox().catch(() => null); return b ? [Math.round(b.x), Math.round(b.y), Math.round(b.x + b.width), Math.round(b.y + b.height)] : null; };
const go = async (p, w = 7000) => { await page.goto(H + p, { waitUntil: 'domcontentloaded' }); await sleep(w); if (await signedOut()) throw new Error('SIGNED_OUT'); };
const active = async () => page.evaluate(() => { const a = document.activeElement; return a ? (a.tagName + ' ' + (a.getAttribute('aria-label') || a.getAttribute('name') || a.id || '') + ' ' + (a.innerText || a.value || '').slice(0, 30)).trim() : null; });

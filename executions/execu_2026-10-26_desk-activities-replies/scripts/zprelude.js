// Zoho Desk read-only helpers. Never click Save/Send/Submit/Update/Delete.
const Z = 'https://desk.zoho.com/agent/taviportal/anyware-software'; const SHOT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-26_desk-activities-replies/evidence/raw';
const sleep = ms => page.waitForTimeout(ms); const txt = async () => (await page.innerText('body')).replace(/\n\s*\n+/g, '\n');
const go = async (u, w) => { await page.goto(u.startsWith('http') ? u : Z + u, { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(w || 9000); };
const shot = async n => { try { await page.screenshot({ path: SHOT + '/zoho-' + n + '.png', timeout: 20000 }); return 'zoho-' + n + '.png'; } catch (e) { return 'shot failed'; } };
const vis = async sel => page.$$eval(sel || 'button, [role=menuitem], [role=tab], a, li', bs => [...new Set(bs.filter(b => b.offsetParent !== null).map(b => (b.getAttribute('aria-label') || b.getAttribute('title') || b.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 50)).filter(Boolean))]);
const out = {}; const done = () => JSON.stringify(out);

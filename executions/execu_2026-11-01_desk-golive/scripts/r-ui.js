// 12 Nov resume, owner screen checks: W2-13 template prefill, W2-30 signature page, W2-64 ticket number page, W2-49 30 MB attach on screen, roles of B and C
const o = {};
const waitText = async (re, n) => { for (let i = 0; i < (n || 25); i++) { await sleep(1000); const t = await txt().catch(() => ''); if (re.test(t)) return t; } return await txt().catch(() => ''); };
const flat = async () => (await txt()).replace(/\s+/g, ' ');
// W2-13
await go(`/modules/${T}/records/new`, 9000);
const ut = page.locator('button, [role=combobox]', { hasText: /Use template/i }).first(); o.useTpl = await ut.count();
if (o.useTpl) { await ut.click().catch(() => {}); await sleep(2000); const opt = page.locator('[role=option], [role=menuitem], li, button', { hasText: /QA GL W2 template/ }).first(); o.tplOpt = await opt.count(); if (o.tplOpt) { await opt.click().catch(() => {}); await sleep(3000); } }
o.subjectVals = await page.$$eval('input', is => is.filter(i => i.offsetParent !== null && /QA GL W2/.test(i.value)).map(i => [i.name || i.id || i.getAttribute('aria-label'), i.value]));
o.prioText = ((await flat()).match(/Priority[^A-Z]{0,30}(Low|Medium|High|Urgent|-None-|None)/) || [''])[0];
o.shotTpl = await shot('../wave2n/r-template-prefill');
await page.locator('button', { hasText: /^Cancel$/ }).first().click().catch(() => {}); await sleep(1500);
const leave = page.locator('[role=dialog] button', { hasText: /Discard|Leave|Yes/i }).first(); if (await leave.count()) await leave.click().catch(() => {});
// W2-30
await go('/settings/personal/signatures', 10000); o.sigPage = (await flat()).slice(0, 500); o.sigButtons = await page.$$eval('button', bs => bs.filter(b => b.offsetParent !== null).map(b => b.innerText.trim()).filter(Boolean).slice(-15)); o.shotSig = await shot('../wave2n/r-signature-page');
// W2-64
await go('/setup', 8000); const tn = page.locator('a', { hasText: /^Ticket Number$/ }).first(); o.tnLink = await tn.count();
if (o.tnLink) { await tn.click().catch(() => {}); await sleep(12000); o.tnUrl = page.url(); o.tnPage = (await flat()).replace(/^.*?Ticket Number/, 'Ticket Number').slice(0, 600); o.shotTn = await shot('../wave2n/r-ticket-number'); }
// roles page for B and C
await go('/setup', 8000); const rl = page.locator('a', { hasText: /^Roles$/ }).first(); if (await rl.count()) { await rl.click().catch(() => {}); await sleep(12000); o.rolesUrl = page.url(); o.rolesPage = (await flat()).replace(/^.*?Roles/, 'Roles').slice(0, 900); o.shotRoles = await shot('../wave2n/r-roles'); }
return done(o);

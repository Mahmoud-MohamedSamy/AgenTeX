const RAW = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
const ID = 'cca267b4-989c-47e8-8fa2-70b9d5935626'; const D = '/settings/automation/blueprints/' + ID;
const net = []; page.on('response', r => { const u = r.url(); if (/\/api\/v1\//.test(u) && !/\/iam\/auth/.test(u) && r.request().method() !== 'GET') net.push(r.request().method() + ' ' + r.status() + ' ' + u.split('/api/v1')[1].replace(/[0-9a-f-]{36}/g, '{id}').slice(0, 70)); });
const editOpen = async () => { const ed = page.getByRole('button', { name: 'Edit' }).first(); if (await ed.count()) { await ed.click(); await sleep(1000); } };
const orig = await ctx.cookies();
await page.goto(H + D, { waitUntil: 'domcontentloaded' }); await sleep(10000); await editOpen();
const before = await page.locator('textarea').first().inputValue(); log('desc on server', before);
const NEWD = 'QA RT19 3035 unsaved change ' + new Date().toISOString().slice(11, 19);
await page.locator('textarea').first().fill(NEWD); await sleep(1500); log('typed', NEWD);
log('ls bp keys after edit', await page.evaluate(() => Object.keys(localStorage).filter(k => /blueprint/i.test(k)).length));
await shot('3035-1-unsaved-change.png');
// simulate expiry in this browser only: both cookies replaced by invalid values
await ctx.addCookies(orig.map(c => ({ ...c, value: 'expired-by-qa' })));
await page.getByRole('button', { name: 'Save and Publish' }).click(); await sleep(8000);
const t1 = (await text()).replace(/\s+/g, ' '); const e = t1.search(/session expired|sign in/i);
log('after save url', page.url().replace(H, '').replace(/[0-9a-f-]{36}/g, '{id}'), 'text', e >= 0 ? t1.slice(Math.max(0, e - 80), e + 200) : t1.slice(0, 200));
await shot('3035-2-session-expired.png');
const afterUrl = page.url();
// "sign in again": put the real session back (no password sign-in), follow the sign-in page's return address
await ctx.clearCookies(); await ctx.addCookies(orig);
const ret = (() => { try { const u = new URL(afterUrl); return u.searchParams.get('returnTo') || u.searchParams.get('redirect') || u.searchParams.get('next') || u.searchParams.get('return_to'); } catch (x) { return null; } })();
log('return param', ret ? ret.replace(/[0-9a-f-]{36}/g, '{id}') : null);
await page.goto(ret ? (ret.startsWith('http') ? ret : H + ret) : H + D, { waitUntil: 'domcontentloaded' }); await sleep(10000);
log('back url', page.url().replace(H, '').replace(/[0-9a-f-]{36}/g, '{id}'));
const t2 = (await text()).replace(/\s+/g, ' '); const u = t2.search(/unsaved changes/i); log('offer', u >= 0 ? t2.slice(u - 10, u + 250) : 'NO OFFER');
await shot('3035-3-restore-offer.png');
const rs = page.getByRole('button', { name: 'Restore' }).first(); if (await rs.count()) { await rs.click(); await sleep(2500); }
await editOpen(); log('desc after Restore', await page.locator('textarea').first().inputValue());
await shot('3035-4-after-restore.png');
log('net', net);
return { ok: 1 };

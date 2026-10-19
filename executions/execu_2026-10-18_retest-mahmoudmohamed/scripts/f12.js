// NDC-1819 item 11: which API serves the period buckets, and what Overdue / Today & Overdue return.
const out = { calls: [] };
await page.goto(H + '/workqueue', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 40 && !(await page.getByRole('button', { name: /^Tasks\b/ }).count()); i++) await sleep(1000); await sleep(2000);
const f = async r => { const u = r.url(); if (u.includes('/api/') && /activit|workqueue/i.test(u) && !/\/iam\/auth/.test(u)) { let b = ''; try { b = (await r.text()).slice(0, 300); } catch (e) { } out.calls.push(r.status() + ' ' + r.request().method() + ' ' + u.replace(API, '') + ' ' + (r.request().postData() || '').slice(0, 300) + ' => ' + b); } };
page.on('response', f);
const sel = page.getByRole('button', { name: 'Which open activities to count and list' });
await sel.click(); await sleep(800); await page.locator('[role=listbox] [role=option], [role=menu] [role^=menuitem]').filter({ hasText: /^\s*Overdue\s*$/ }).first().click(); await sleep(8000);
page.off('response', f);
await sel.click(); await sleep(800); await page.locator('[role=listbox] [role=option], [role=menu] [role^=menuitem]').filter({ hasText: /^\s*All open\s*$/ }).first().click(); await sleep(3000);
out.calls = out.calls.slice(0, 12);
return done(out);

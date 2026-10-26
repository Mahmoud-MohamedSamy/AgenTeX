// Reminder editor: open on the QA G task, dump controls, set "5 minutes before" + pop-up, save, read API
const net = []; const onR = async r => { const q = r.request(); if (q.method() !== 'GET' && r.url().includes('/reminders')) net.push(q.method() + ' ' + r.url().replace(API, '') + ' ' + (q.postData() || '').slice(0, 400) + ' -> ' + r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 300)); }; page.on('response', onR);
const L = await api('GET', `/modules/${M.tasks}/records?page=1&per_page=30&sort_by=created_at&sort_dir=desc`); const t = ((L.j.data.records || L.j.data.items || L.j.data) || []).map(fl).find(x => x.subject === 'QA ACT G task').id;
await go(`/modules/${M.tasks}/records/${t}`, 8000);
await page.getByRole('button', { name: 'Set Reminder', exact: true }).click(); await sleep(2000);
const ctr = await page.$$eval('input, select, button, [role=radio], [role=checkbox], [role=combobox]', es => es.filter(e => e.offsetParent !== null).map(e => [e.tagName, e.type || e.getAttribute('role') || '', e.getAttribute('aria-label') || '', (e.innerText || '').trim().slice(0, 30), e.value || '', e.tagName === 'SELECT' ? [...e.options].map(o => o.text).join('/') : ''].join('|')).filter(x => !/Collapse|Edit |Open |Search|Switch|Calendar|Notifications|EN|More modules|Create in/.test(x)));
const s = await shot('ACT-G-editor');
// fill: timing select -> before, number 5, unit minutes, popup checkbox
const sels = page.locator('main select');
for (let i = 0; i < await sels.count(); i++) { const opts = await sels.nth(i).evaluate(s => [...s.options].map(o => o.value)); if (opts.includes('before')) await sels.nth(i).selectOption('before'); if (opts.includes('minutes')) await sels.nth(i).selectOption('minutes'); }
await sleep(500);
const nums = page.locator('main input[type=number]'); if (await nums.count()) await nums.first().fill('5');
const pop = page.getByLabel('Pop-up'); if (await pop.count()) await pop.first().check().catch(() => {});
await sleep(300);
const saveB = page.locator('main button').filter({ hasText: /^Save$/ }); if (await saveB.count()) await saveB.last().click(); await sleep(3000);
const rl = await api('GET', `/desk/activities/${t}/reminders`);
const card = ((await txt()).match(/Reminders?[\s\S]{0,200}/) || [''])[0].replace(/\n/g, ' / ');
page.off('response', onR);
rec('ACT-G2', rl.s === 200 && /before|minutes|offset/i.test(rl.t) ? 'PASS' : 'INFO', 'card=' + card + ' | GET ' + rl.s + ' ' + rl.t.slice(0, 400) + ' | net=' + net.join(' || '), { ctr, s });
return fin({ task: t });

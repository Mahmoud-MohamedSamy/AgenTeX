const D = '/desk/departments'; const id = '0d3c1585-5df2-40c2-894c-752cbdaead08'; const o = {};
const g = (await api('GET', D + '/' + id)).j.data; o.before = g.visibility; o.agentIds = g.agent_user_ids;
await go('/settings/organization/departments/' + id, 15000);
const sw = page.locator('[role=switch],input[type=checkbox],[role=checkbox]').first();
await sw.click({ force: true }); await sleep(1000); o.checked = await sw.getAttribute('aria-checked');
const save = page.getByRole('button', { name: /^Save/ }).first(); o.saveEnabled = await save.isEnabled().catch(() => false);
const reqs = []; const h = r => { if (r.url().includes('/desk/departments/') && ['PATCH', 'PUT'].includes(r.method())) reqs.push(r.method() + ' ' + (r.postData() || '').slice(0, 600)); }; page.on('request', h);
if (o.saveEnabled) { await save.click(); await sleep(6000); }
page.off('request', h); o.sent = reqs;
o.after = (await api('GET', D + '/' + id)).j.data.visibility;
return done(o);

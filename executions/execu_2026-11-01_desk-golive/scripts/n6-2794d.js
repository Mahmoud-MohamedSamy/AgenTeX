const o = {};
await page.goto(H + '/settings/automation/workflow-rules/19222c73-dc19-4016-838c-9eb39d68a5dc', { waitUntil: 'commit' }).catch(() => {});
for (let i = 0; i < 30; i++) { await sleep(1500); const t = await txt(); if (/Owner Assignment/.test(t) && /QA RT 2794/.test(t)) break; }
await sleep(4000);
const cb = page.getByText('Also assign an agent of this team', { exact: true }).first(); o.cb = await cb.count(); await cb.scrollIntoViewIfNeeded().catch(() => {});
await cb.click().catch(e => o.e = e.message.slice(0, 60)); await sleep(1500);
const t = (await txt()).replace(/\s+/g, ' '); const i = t.indexOf('Also assign an agent'); o.after = t.slice(i, i + 400);
o.selects = await page.$$eval('select', ss => ss.filter(s => s.offsetParent).map(s => [s.value, [...s.options].map(x => x.text).slice(0, 8)]));
o.shot = await shot('rt/2794-also-agent');
return JSON.stringify(o);

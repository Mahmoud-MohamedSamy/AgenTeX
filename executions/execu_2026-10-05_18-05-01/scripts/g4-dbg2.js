const QA = arr((await api('GET', '/modules')).j.data).find(m => m.moduleKey === 'desk_qa_mf_assets');
await go(`/settings/modules-and-fields/${QA.id}`, 6000);
await page.getByRole('button', { name: /Create New Layout/ }).click(); await sleep(8000);
const t = page.locator('[title="Click to rename layout"]'); const n = await t.count();
const tag = n ? await t.first().evaluate(e => e.outerHTML.slice(0, 300)) : '';
if (n) { await t.first().click(); await sleep(800); }
await shot('dbg-g4-rename');
const ins = await page.evaluate(() => [...document.querySelectorAll('input')].filter(e => e.getBoundingClientRect().y < 120 && e.getBoundingClientRect().width).map(e => e.outerHTML.slice(0, 200)));
const pv = await page.evaluate(() => [...document.querySelectorAll('button,a,span')].filter(e => /^Preview$/.test(e.innerText.trim())).map(e => e.outerHTML.slice(0, 160)));
page.off('request', onReq);
return JSON.stringify({ n, tag, ins, pv });

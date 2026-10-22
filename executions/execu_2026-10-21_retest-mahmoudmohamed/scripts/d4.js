const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', PS = '5170500c-b335-479c-96d1-ed138965c345';
if (!(await page.locator('[role=dialog]').count())) { await page.getByRole('button', { name: 'Stage Probability' }).click(); await sleep(2500); }
const readRow = async () => { const r = page.locator('[role=dialog] tr').filter({ hasText: /^\s*qualification/ }).first(); return { p: await r.locator('input').first().inputValue(), f: await r.locator('select').last().evaluate(s => s.options[s.selectedIndex].text) }; };
const std = await readRow();
const pb = page.locator('[role=dialog] button[aria-haspopup=listbox], [role=dialog] select').first();
const tag = await pb.evaluate(e => e.tagName);
if (tag === 'SELECT') await pb.selectOption({ label: '1' }); else { await pb.click(); await sleep(800); await page.locator('[role=listbox] [role=option]').filter({ hasText: /^\s*1\s*$/ }).first().click(); }
await sleep(2000);
const head = (await page.locator('[role=dialog]').innerText()).match(/Editing the stages of[^\n]*/)?.[0];
const p1 = await readRow();
await shot('1308-03-modal-pipeline1');
await page.locator('[role=dialog]').getByRole('button', { name: 'Cancel' }).click(); await sleep(800);
// restore Standard qualification 10/pipeline (exact original list)
const cur = (await api('GET', `/modules/${D}/stage-probability?pipeline_id=${PS}`)).j.data.map(x => ({ stageValue: x.stageValue, probability: x.stageValue === 'qualification' ? 10 : x.probability, recordCategory: x.recordCategory, forecastCategory: x.stageValue === 'qualification' ? 'pipeline' : x.forecastCategory }));
const put = await api('PUT', `/modules/${D}/stage-probability?pipeline_id=${PS}`, cur);
const fin = (await api('GET', `/modules/${D}/stage-probability?pipeline_id=${PS}`)).j.data.find(x => x.stageValue === 'qualification');
return done({ std, tag, head, p1, restore: put.s, fin });

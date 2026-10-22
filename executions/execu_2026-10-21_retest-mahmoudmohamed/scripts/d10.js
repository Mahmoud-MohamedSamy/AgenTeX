const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', P1 = '640e03a4-9c24-4b06-8d7d-5c1db2711b9b';
const add = await api('POST', `/modules/${D}/pipelines/${P1}/stages`, { stage_value: 'qa_rt_1295' });
await go('/settings/pipelines', 15000); for (let i = 0; i < 30 && !(await page.getByRole('button', { name: 'Add Stages' }).count()); i++) await sleep(1000);
await page.getByRole('button', { name: 'Add Stages' }).nth(1).click(); await sleep(1500);
const opts = await page.locator('label, [role=option], li').filter({ hasText: /^[a-z_0-9-]+$/ }).allInnerTexts();
await page.getByPlaceholder('Search stages…').fill('qa_rt'); await sleep(1000);
const filtered = (await txt()).match(/Search stages[\s\S]{0,200}/)?.[0];
await shot('1295-05-addstages-after-delete');
return done({ add: add.s + ' ' + add.t.slice(0, 300), opts: [...new Set(opts)], filtered });

let tries = 0;
for (; tries < 4; tries++) { await page.reload({ waitUntil: 'commit' }); for (let i = 0; i < 25 && !(await page.getByRole('button', { name: 'Add Stages' }).count()); i++) await sleep(1000); if (await page.getByRole('button', { name: 'Add Stages' }).count()) break; }
await page.getByRole('button', { name: 'Add Stages' }).nth(1).click(); await sleep(1500);
const all = (await txt()).match(/Search stages…?([\s\S]*?)Create New Stage/)?.[1];
await page.getByPlaceholder(/Search stages/).fill('qa_rt'); await sleep(1000);
const filtered = (await txt()).match(/Search stages…?([\s\S]*?)Create New Stage/)?.[1];
await shot('1295-05-addstages-after-delete');
return done({ tries, all, filtered });

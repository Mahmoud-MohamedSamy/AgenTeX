await page.mouse.click(1202, 457); await sleep(1500);
const opts = await page.evaluate(() => [...document.querySelectorAll('[role=option], [role=menuitem], [cmdk-item]')].map(e => e.innerText.trim().replace(/\n/g, ' ')).slice(0, 15));
await shot('1302-02-pipeline-options');
let picked = null;
const one = page.getByRole('option', { name: /^1\b/ }).first();
if (await one.count()) { await one.click(); await sleep(1500); picked = '1'; }
const after = ((await txt()).match(/Pipeline[\s\S]{0,60}/) || [''])[0];
await shot('1302-03-pipeline-picked');
return done({ opts, picked, after });

const id = fs.readFileSync(RUN + '/out/h1-url.txt', 'utf8').trim().split('/').pop();
await page.goto(H + `/modules/${made.mod}/records/${id}`, { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 30; i++) { await sleep(2000); if (/QA FX UI DOUBLE/i.test(await text('main'))) break; }
await page.getByRole('button', { name: /Send Email/ }).first().click(); await sleep(4000); await shot('I9-compose2');
const btns = await page.locator('[role=dialog] button').evaluateAll(b => b.map(x => (x.getAttribute('aria-label') || x.title || x.innerText).trim()).filter(Boolean)); log('buttons', btns.slice(0, 40));
const mf = page.locator('[role=dialog] button').filter({ hasText: /merge|insert field|\{|placeholder|variable/i }).first(); const mf2 = page.locator('[role=dialog] [aria-label*="merge" i], [role=dialog] [title*="merge" i], [role=dialog] [aria-label*="field" i]').first();
const m = (await mf.count()) ? mf : mf2; log('merge control', await m.count());
if (await m.count()) { await m.click(); await sleep(1500); const list = (await page.locator('[role=listbox], [role=menu], [role=dialog]').last().innerText()).replace(/\n+/g, ' | '); log('merge list has QA FX UI Double', /QA FX UI Double/i.test(list), list.slice(0, 500)); await shot('I9-merge-list'); }

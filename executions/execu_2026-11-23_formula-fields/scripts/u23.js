const id = fs.readFileSync(RUN + '/out/h1-url.txt', 'utf8').trim().split('/').pop();
await page.goto(H + `/modules/${made.mod}/records/${id}`, { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 30; i++) { await sleep(2000); if (/QA FX UI DOUBLE/i.test(await text('main'))) break; }
await page.getByRole('button', { name: /Send Email/ }).first().click(); await sleep(4000); await shot('I9-compose');
const d = (await page.locator('[role=dialog]').allInnerTexts()).join(' || '); log('compose', d.slice(0, 600).replace(/\n+/g, ' | '));
const btns = await page.locator('[role=dialog] button').evaluateAll(b => b.map(x => (x.getAttribute('aria-label') || x.title || x.innerText).trim()).filter(Boolean)); log('buttons', btns.slice(0, 40));

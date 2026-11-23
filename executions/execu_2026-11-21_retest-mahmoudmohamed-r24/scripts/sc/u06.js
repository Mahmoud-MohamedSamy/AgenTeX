const out = { req: [] };
page.on('request', r => { if (/views/.test(r.url()) && r.method() !== 'GET') out.req.push(r.method() + ' ' + r.url().replace(/.*\/api\/v1/, '') + ' ' + (r.postData() || '').slice(0, 700)); });
page.on('response', r => { if (/views/.test(r.url()) && r.request().method() !== 'GET') out.req.push('<- ' + r.status()); });
await go('/modules/' + MID, 9000);
await page.getByRole('button', { name: 'Custom views' }).first().click(); await sleep(1200);
await page.getByText(/New custom view/i).first().click(); await sleep(3000);
await page.getByPlaceholder('Enter custom view name').fill('QA RT20 SC hot leads');
await page.getByText('Filter by criteria').click(); await sleep(1500);
const sec = page.locator('section, div').filter({ hasText: /^Specify criteria/ }).first();
out.critControls = await page.locator('main select, main [role=combobox], main button').evaluateAll(e => e.map(x => (x.getAttribute('aria-label') || '') + '|' + (x.innerText || '').slice(0, 25)).filter(s => s.length > 1)).then(a => a.slice(0, 30));
// field picker: first combobox / select in criteria
const fsel = page.locator('main select').first();
if (await fsel.count()) { out.fieldOpts = (await fsel.locator('option').allInnerTexts()).filter(x => /score/i.test(x)); }
const cbx = page.locator('main [role=combobox]').first();
if (!out.fieldOpts && await cbx.count()) { await cbx.click(); await sleep(800); await page.keyboard.type('Score'); await sleep(800); out.fieldOpts = await page.locator('[role=option]').allInnerTexts(); }
await shot('1483-15-view-criteria.png');
return out;

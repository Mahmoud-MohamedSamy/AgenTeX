const opt = () => page.locator('[role=listbox] [role=option]');
const rowTxt = async () => (await page.locator('[role=group][aria-label="Filter these records"]').innerText().catch(() => '(no panel)')).replace(/\s+/g, ' ').trim();
const total = async () => ((await page.locator('main').last().innerText().catch(() => '')).match(/Total Records\s*\d+/) || ['?'])[0];
const badge = async () => { const b = page.locator('main button[aria-label*="ilter"]').first(); return (await b.getAttribute('aria-label').catch(() => '')) || ''; };
const openWQ = async () => { await page.goto(H + '/workqueue', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 40 && !(await page.getByRole('button', { name: /^Tasks, / }).count()); i++) await sleep(1000); await sleep(1500); };
const pick = async (re) => { await page.getByRole('button', { name: re }).first().click(); await sleep(5000); };
const panel = async () => { if (!(await page.getByRole('button', { name: 'Criteria field' }).count())) { const b = page.locator('main button[aria-label*="ilter"]').first(); if (await b.count()) { await b.click(); await sleep(1500); } } };
const state = async () => { await panel(); return { row: await rowTxt(), total: await total(), funnel: await badge() }; };
// Cleanup step 7: restore the Tasks Work Queue filter "Priority equals highest" (it existed before the run); check the 1821 leads.
const out = {};
await openWQ(); await pick(/^Tasks, /);
out.before = await state();
if (await page.getByRole('button', { name: 'Clear filters' }).count()) { await page.getByRole('button', { name: 'Clear filters' }).click(); await sleep(3000); }
await panel();
await page.getByRole('button', { name: 'Criteria field' }).first().click(); await sleep(900);
await page.getByPlaceholder('Search fields').fill('Priority'); await sleep(600); await opt().filter({ hasText: /^Priority$/ }).first().click(); await sleep(1200);
await page.locator('button[aria-label^="Operator for"]').first().click(); await sleep(700); await opt().filter({ hasText: /^Equals$/ }).click(); await sleep(800);
await page.locator('button[aria-label^="Value for"]').first().click(); await sleep(900); await opt().filter({ hasText: /^highest$/ }).click(); await sleep(800); await page.keyboard.press('Escape'); await sleep(5000);
out.after = await state();
const tp = await api('GET', '/modules/a9d87b62-b704-4c2e-b2d5-1b745d7c2065/list-preferences'); out.saved = JSON.stringify(tp.j && tp.j.data && tp.j.data.prefs && tp.j.data.prefs.workqueueFilters);
const s = await api('GET', '/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/records?page=1&per_page=20&search=' + encodeURIComponent('del-')); out.leads1821 = arr(s.j && s.j.data).map(r => ((r.data || []).find(x => x.field === 'first_name') || { value: {} }).value.value).filter(n => /QA RT/.test(n || ''));
return done(out);

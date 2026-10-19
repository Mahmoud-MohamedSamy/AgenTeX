const opt = () => page.locator('[role=listbox] [role=option]');
const rowTxt = async () => (await page.locator('[role=group][aria-label="Filter these records"]').innerText().catch(() => '(no panel)')).replace(/\s+/g, ' ').trim();
const total = async () => ((await page.locator('main').last().innerText().catch(() => '')).match(/Total Records\s*\d+/) || ['?'])[0];
const badge = async () => { const b = page.locator('main button[aria-label*="ilter"]').first(); return (await b.getAttribute('aria-label').catch(() => '')) || ''; };
const openWQ = async () => { await page.goto(H + '/workqueue', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 40 && !(await page.getByRole('button', { name: /^Tasks, / }).count()); i++) await sleep(1000); await sleep(1500); };
const pick = async (re) => { await page.getByRole('button', { name: re }).first().click(); await sleep(5000); };
const panel = async () => { if (!(await page.getByRole('button', { name: 'Criteria field' }).count())) { const b = page.locator('main button[aria-label*="ilter"]').first(); if (await b.count()) { await b.click(); await sleep(1500); } } };
const state = async () => { await panel(); return { row: await rowTxt(), total: await total(), funnel: await badge() }; };
const out = {};
await openWQ(); await pick(/^Tasks, /); let b = ''; for (let i = 0; i < 15; i++) { b = await badge(); if (/applied/.test(b)) break; await sleep(1000); }
await panel(); out.newLoginViaWQ = { badge: b, total: await total(), row: await rowTxt() }; await shot('NDC-1789-3-new-login');
await page.getByRole('button', { name: 'Clear filters' }).click(); await sleep(4000); out.cleared = { badge: await badge(), total: await total() };
await openWQ(); await pick(/^Tasks, /); await sleep(6000); out.afterClearReload = { badge: await badge(), total: await total() }; await shot('NDC-1789-4-cleared-stays');
return done(out);

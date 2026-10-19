const opt = () => page.locator('[role=listbox] [role=option]');
const rowTxt = async () => (await page.locator('[role=group][aria-label="Filter these records"]').innerText().catch(() => '(no panel)')).replace(/\s+/g, ' ').trim();
const total = async () => ((await page.locator('main').last().innerText().catch(() => '')).match(/Total Records\s*\d+/) || ['?'])[0];
const badge = async () => { const b = page.locator('main button[aria-label*="ilter"]').first(); return (await b.getAttribute('aria-label').catch(() => '')) || ''; };
const openWQ = async () => { await page.goto(H + '/workqueue', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 40 && !(await page.getByRole('button', { name: /^Tasks, / }).count()); i++) await sleep(1000); await sleep(1500); };
const pick = async (re) => { await page.getByRole('button', { name: re }).first().click(); await sleep(5000); };
const panel = async () => { if (!(await page.getByRole('button', { name: 'Criteria field' }).count())) { const b = page.locator('main button[aria-label*="ilter"]').first(); if (await b.count()) { await b.click(); await sleep(1500); } } };
const state = async () => { await panel(); return { row: await rowTxt(), total: await total(), funnel: await badge() }; };
const T = 'a9d87b62-b704-4c2e-b2d5-1b745d7c2065'; const out = {};
await shot('NDC-1789-3-new-login'); out.newLogin = { url: page.url().replace(H, ''), badge: await badge(), total: await total() };
const r = await api('GET', '/modules/' + T + '/list-preferences'); out.storedPref = (r.t.match(/"workqueueFilters":\{[^}]*\}/) || ['none'])[0].slice(0, 200);
await pick(/^Calls, /); await pick(/^Tasks, /); let b = ''; for (let i = 0; i < 10; i++) { b = await badge(); if (/applied/.test(b)) break; await sleep(1000); }
out.afterSectionSwitch = { badge: b, total: await total() };
return done(out);

await page.goto(H + '/settings/data/recycle-bin', { waitUntil: 'commit', timeout: 90000 }); for (let k = 0; k < 60; k++) { await sleep(1000); if (/d+ items/.test(await txt().catch(() => ''))) break; } await sleep(1500);
await page.getByRole('button', { name: 'Filters', exact: true }).click(); await sleep(1200);
const openDD = async name => { await page.getByRole('button', { name, exact: true }).last().click(); await sleep(1200); };
const readOpts = () => page.evaluate(() => { const c = document.querySelector('[data-radix-popper-content-wrapper], [role=listbox], [role=menu]'); if (!c) return []; return [...c.querySelectorAll('[role=option], [role=menuitemcheckbox], [role=menuitem], label, li')].map(e => e.innerText.trim()).filter(Boolean); });
await openDD('Module'); const all = [...new Set(await readOpts())];
await shot('1597-01-module-dropdown');
const search = page.locator('[data-radix-popper-content-wrapper] input, [role=listbox] input').first(); const res = {};
for (const q of ['pipeline', 'review', 'assignment', 'action', 'blueprint', 'zzz']) { if (await search.count()) { await search.fill(q); await sleep(700); res[q] = [...new Set(await readOpts())].slice(0, 6); const empty = await page.evaluate(() => (document.querySelector('[data-radix-popper-content-wrapper]') || {}).innerText?.match(/No [^\n]*/)?.[0] || null); if (empty) res[q + '_msg'] = empty; } }
if (await search.count()) await search.fill('');
await page.keyboard.press('Escape');
return done({ n: all.length, all, lower: all.filter(o => /^[a-z]/.test(o)), res });

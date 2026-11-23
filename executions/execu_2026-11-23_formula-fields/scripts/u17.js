const ids = JSON.parse(fs.readFileSync(RUN + '/out/ui-ids.json', 'utf8'));
const open = async (id, re) => { await page.goto(H + `/modules/${made.mod}/records/${id}`, { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 30; i++) { await sleep(2000); if (re.test(await text('main'))) break; } await sleep(1500); };
const after = (t, label, n = 60) => { const i = t.search(label); return i < 0 ? '(not found)' : JSON.stringify(t.slice(i, i + n)); };
// B11 blank display
await open(ids.blank, /QA FX UI DOUBLE/i); let t = await text('main'); log('B11 blank record: show-empty toggle?', /Show \d+ empty fields/.test(t), after(t, /QA FX F1/i));
const se = page.getByText(/Show \d+ empty fields/).first(); if (await se.count()) { await se.click(); await sleep(1500); t = await text('main'); log('after show empty', after(t, /QA FX UI DOUBLE/i), after(t, /QA FX L1 HTML/i)); }
await page.getByText(/QA FX UI Double/i).first().scrollIntoViewIfNeeded().catch(() => { }); await shot('B11-blank-record');
// M2 Arabic text in EN UI then AR UI (M1)
await open(ids.ar, /QA FX M2/i); await page.getByText(/^QA FX M2$/i).first().scrollIntoViewIfNeeded().catch(() => { }); await sleep(500); log('M2 EN', after(await text('main'), /QA FX M2\n/i, 50)); await shot('M2-en');
await page.evaluate(() => localStorage.setItem('anyware_language', 'ar')); await open(ids.ar, /QA FX M2/i);
const dir = await page.evaluate(() => document.documentElement.dir); await page.getByText(/^QA FX M2$/i).first().scrollIntoViewIfNeeded().catch(() => { }); await sleep(500); log('M1/M2 AR dir', dir, after(await text('main'), /QA FX M2\n/i, 50)); await shot('M2-ar');
await page.evaluate(() => localStorage.setItem('anyware_language', 'en'));
// H10 clone
await open(ids.clone, /QA FX UI DOUBLE/i); log('source value', after(await text('main'), /QA FX UI DOUBLE/i, 25));
const more = page.locator('button[aria-label*="More" i], button[aria-label*="actions" i]').first(); log('more buttons', await page.locator('button[aria-label]').evaluateAll(b => b.map(x => x.getAttribute('aria-label')).filter(Boolean).slice(0, 25)));

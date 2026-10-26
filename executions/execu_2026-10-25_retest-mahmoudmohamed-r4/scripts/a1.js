// NDC-1344: Audit Log entity filter — list every option, find duplicates and raw names; feed labels.
await page.goto(H + '/settings/security/audit-log', { waitUntil: 'commit', timeout: 90000 });
for (let k = 0; k < 60; k++) { await sleep(1000); if (/All Entities|Entity/.test(await txt().catch(() => ''))) break; } await sleep(2500);
const feed = (await txt()).split('\n').filter(l => /audit\.|entity\.|\b[a-z]+_[a-z_]+\b/.test(l)).slice(0, 10);
const b = page.getByRole('button', { name: /All Entities/ }).first().or(page.getByRole('combobox', { name: /Entit/ }).first()).first(); await b.click(); await sleep(1500);
const opts = await page.evaluate(() => { const c = document.querySelector('[role=listbox], [role=menu], [data-radix-popper-content-wrapper]'); if (!c) return []; const sc = c.querySelector('[style*=overflow], [class*=overflow]') || c; return [...c.querySelectorAll('[role=option], [role=menuitemcheckbox], [role=menuitem], [cmdk-item], label, [role=group] > div')].map(e => e.innerText.trim()).filter(Boolean); });
await shot('1344-01-filter-open');
const norm = s => s.toLowerCase().replace(/\s+/g, ' ');
const seen = {}; for (const o of opts) seen[norm(o)] = (seen[norm(o)] || 0) + 1;
const dups = Object.entries(seen).filter(([, n]) => n > 1).map(([k, n]) => k + ' ×' + n);
const raw = opts.filter(o => /_|\.|^[a-z]/.test(o));
return done({ n: opts.length, opts, dups, raw, feed });

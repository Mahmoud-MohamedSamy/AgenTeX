const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', C = '6f553963-01d6-4b68-9fb3-143d23044c41', D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', T = 'a9d87b62-b704-4c2e-b2d5-1b745d7c2065';
const cases = [['1', `/modules/${L}?view=23d6424a-69aa-4da1-9ffa-a95cc38d7425&layout=563411f4-6c8e-4b98-a91d-c618d88a5138`, 'Leads'], ['2', `/modules/${L}?view=64c7dbc3-888c-46c1-af86-cc897a3d68f7&layout=563411f4-6c8e-4b98-a91d-c618d88a5138`, 'Leads'], ['3', `/modules/${L}?view=042efe3a-6441-4c1c-9807-6a53373a5176&layout=563411f4-6c8e-4b98-a91d-c618d88a5138`, 'Leads'], ];
const out = {};
for (const [n, url, tag] of cases) {
  await page.goto(H + url, { waitUntil: 'commit', timeout: 120000 });
  let line = null; for (let k = 0; k < 120; k++) { await sleep(1000); const t = await txt().catch(() => ''); const m = t.match(/\n([^\n]*(?:سجل|سجلات|سجلاً|سجلان|records?)[^\n]*)\n/); if (m && !/جارٍ|Loading|تحميل/.test(t.slice(0, 2000))) { line = m[1].trim(); if (k > 3) break; } }
  await sleep(2000); const t = await txt(); const m = t.match(/\n([^\n]*(?:سجل|سجلات|سجلاً|سجلان|records?)[^\n]*)\n/); out[n] = { line: m ? m[1].trim() : line, english: /\brecords?\b/.test(t) };
  await shot('2130-count-' + n);
}
return done(out);

// Screen check: record page of the filled record on each layout -> every formula label present + shown value matches API. Env REC=recFull|recFull2
const k = process.env.REC || 'rFull'; const R = JSON.parse(fs.readFileSync(RUN + '/out/' + process.env.RECFILE, 'utf8'))[k]; const G = process.env.GROUP || '1'; const MOD = process.env.MOD;
const meta = JSON.parse(fs.readFileSync(RUN + '/out/' + (process.env.META || 'fieldmeta.json'), 'utf8'));
const L1 = ['if', 'concat', 'coalesce', 'min', 'max', 'sum', 'avg', 'count', 'upper', 'lower'];
const want = meta.filter(f => /^fx_/.test(f.n) && (G === '1') === L1.includes(f.n.split('_')[1]));
const res0 = {}; const url = H + `/modules/${MOD}/records/${R.id}`; const t0 = Date.now();
await page.goto(url, { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 60; i++) { await sleep(2000); const t = await text(); if (/Basic Information/i.test(t) && /filled/.test(t)) break; }
await sleep(4000); const se = page.getByText(/Show \d+ empty fields/).first(); res0.emptyLink = await se.innerText().catch(() => ''); if (res0.emptyLink) { await se.click().catch(() => {}); await sleep(3000); }
const loadS = Math.round((Date.now() - t0) / 1000);
// scroll through so lazy sections render
for (let i = 0; i < 40; i++) { await page.mouse.wheel(0, 1500); await sleep(250); }
await sleep(1500);
const body = await page.innerText('body'); const lines = body.split('\n').map(s => s.trim()).filter(Boolean); const U = lines.map(x => x.toUpperCase());
await shot((process.env.TAG || '') + k + '-G' + G + '-record-top'); await page.evaluate(() => window.scrollTo(0, 0));
const norm = v => v === null || v === undefined ? '' : typeof v === 'boolean' ? String(v) : typeof v === 'number' ? String(v) : String(v).replace(/\s+/g, ' ').trim();
const shownOk = (shown, api) => { const s = (shown || '').replace(/,/g, '').trim(), a = norm(api);
  if (a === '') return ['', '—', '-', '–', 'N/A', 'Not set', 'None'].includes(s) || /^(—|-|–)$/.test(s);
  if (typeof api === 'boolean') return new RegExp('^(' + (api ? 'true|yes|✓|checked' : 'false|no|✗|unchecked') + ')$', 'i').test(s);
  if (typeof api === 'number') return Math.abs(parseFloat(s.replace(/[^0-9.eE+-]/g, '')) - api) < 1e-6 || s.includes(a);
  return s === a || s.replace(/\s+/g, ' ') === a; };
const res = { ...res0, record: k, url, loadSeconds: loadS, expected: want.length, missing: [], mismatch: [], ok: 0 };
for (const f of want) { const i = U.indexOf(f.label.toUpperCase()); if (i < 0) { res.missing.push(f.label); continue; }
  const shown = lines[i + 1]; const api = R.values[f.n];
  if (shownOk(shown, api) && !want.some(w => w.label.toUpperCase() === (shown || '').toUpperCase())) res.ok++; else res.mismatch.push({ field: f.n, label: f.label, api: norm(api).slice(0, 60), shown: (shown || '').slice(0, 60) }); }
fs.writeFileSync(RUN + `/out/ui-${process.env.TAG || ''}${k}-G${G}.json`, JSON.stringify(res, null, 1));
log({ emptyLink: res.emptyLink, record: k, loadS, expected: res.expected, ok: res.ok, missing: res.missing.length, mismatch: res.mismatch.length, sampleMissing: res.missing.slice(0, 5), sampleMismatch: res.mismatch.slice(0, 8) });

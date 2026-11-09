// NDC-2645: "All fields" export on Leads (Standard layout) — header columns vs layout fields vs all module fields.
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', STD = 'bf971461-2edc-45f2-b6e4-6e180aa64288'; const out = {};
const lay = (await api('GET', `/modules/${L}/layouts/${STD}`)).j?.data; const onLayout = new Set(); JSON.stringify(lay.views).replace(/"apiName":"([^"]+)"/g, (m, a) => onLayout.add(a)); out.layoutFields = onLayout.size;
const all = arr((await api('GET', `/modules/${L}/fields`)).j?.data); out.moduleFields = all.length;
for (const cols of ['all', 'all_fields']) {
  const r = await page.context().request.get(API + `/modules/${L}/records/export?format=csv&scope=page&columns=${cols}&page=1&pageSize=25&layoutId=${STD}&language=en`, { headers: { ...hdr }, timeout: 120000 });
  const t = await r.text(); const head = t.split(/\r?\n/)[0] || ''; const n = head ? head.split(',').length : 0;
  out[cols] = { s: r.status(), columns: n, sample: head.slice(0, 400) };
}
return done(out);

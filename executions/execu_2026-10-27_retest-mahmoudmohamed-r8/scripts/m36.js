const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', STD = 'bf971461-2edc-45f2-b6e4-6e180aa64288'; const out = {};
const lay = (await api('GET', `/modules/${L}/layouts/${STD}`)).j?.data; const onL = new Set(); JSON.stringify(lay.views).replace(/"apiName":"([^"]+)"/g, (m, a) => onL.add(a)); const fl = arr((await api('GET', `/modules/${L}/fields`)).j?.data);
out.layoutFieldLabels = fl.filter(f => onL.has(f.apiName)).map(f => f.labels?.en || f.apiName);
for (const [k, q] of [['dialog-style csv', `format=csv&scope=all&lang=en&sort_by=created_at&sort_dir=desc&layout_id=${STD}`]]) {
  const r = await page.context().request.get(API + `/modules/${L}/records/export?` + q, { headers: { ...hdr }, timeout: 180000 }); const t = await r.text(); const head = (t.split(/\r?\n/)[0] || '').replace(/^\uFEFF/, '');
  out[k] = { s: r.status(), columns: head ? head.split(',').length : 0, header: head.slice(0, 900), rows: t.split(/\r?\n/).filter(Boolean).length - 1 };
}
return done(out);

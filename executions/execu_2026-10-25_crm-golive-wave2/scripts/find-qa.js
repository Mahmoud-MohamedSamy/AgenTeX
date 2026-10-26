const out = {};
for (const [k, id] of Object.entries(MODS)) {
  const r = await call('GET', `/modules/${id}/records?limit=50&search=${encodeURIComponent('QA W2')}`);
  out[k] = r.s === 200 ? (r.j.data || []).map(x => x.id + ' ' + JSON.stringify(x).match(/QA W2[^"]*/)?.[0]) : r.s + ' ' + r.t.slice(0, 100);
}
return out;

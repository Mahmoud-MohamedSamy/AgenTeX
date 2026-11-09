// NDC-2655: business hours (general.company.business_hours). (1) save the stored value unchanged; (2) 24×7 → 09–17 → 24×7 → save unchanged;
// (3) the check still works (24×7 without Sunday refused); restore the original value at the end and compare.
const out = {}; const KEY = 'general.company.business_hours';
const read = async () => (await api('o', 'GET', `/settings/resolved?app_key=general&key=${KEY}&scope_type=Org`)).j?.data;
const put = async (vj, ver) => api('o', 'PUT', '/settings/values', { app_key: 'general', key: KEY, scope_type: 'Org', scope_id: null, value_json: vj, expected_version: ver });
const show = v => { try { const o = typeof v === 'string' ? JSON.parse(v) : v; return JSON.stringify({ preset: o.preset, timing: o.timing_mode ?? o.timingMode, tz: o.time_zone ?? o.timezone, days: (o.days || o.week || []).length, first: JSON.stringify((o.days || o.week || [])[0] || o.hours || '').slice(0, 80) }); } catch (e) { return String(v).slice(0, 200); } };
const orig = await read(); out.original = show(orig?.value_json); out.version = orig?.version; const O = orig?.value_json;
ledger(`setting ${KEY} — original kept in r9-2655 output; restored at the end of the script`);
try {
  const r1 = await put(O, orig.version); out.saveUnchanged = r1.s + ' ' + (r1.s > 299 ? r1.t.slice(0, 250) : '');
  const o = JSON.parse(typeof O === 'string' ? O : JSON.stringify(O)); out.keys = Object.keys(o);
  // 09–17 custom, then back to 24×7, then unchanged again
  const nine = JSON.parse(JSON.stringify(o)); nine.preset = 'custom';
  const v1 = (await read()).version; const r2 = await put(JSON.stringify(nine), v1); out.toCustom = r2.s + ' ' + (r2.s > 299 ? r2.t.slice(0, 250) : '');
  const back = JSON.parse(JSON.stringify(o)); back.preset = '24_7';
  const v2 = (await read()).version; const r3 = await put(JSON.stringify(back), v2); out.back24x7 = r3.s + ' ' + (r3.s > 299 ? r3.t.slice(0, 250) : ''); out.stored24x7 = show((await read()).value_json);
  const v3 = (await read()); const r4 = await put(v3.value_json, v3.version); out.resaveAfterSwitch = r4.s + ' ' + (r4.s > 299 ? r4.t.slice(0, 250) : '');
  // the check still refuses a broken 24×7 (Sunday off)
  const bad = JSON.parse(JSON.stringify(back)); const days = bad.days || bad.week; if (Array.isArray(days) && days[0]) { const d = days.find(x => /sun/i.test(JSON.stringify(x))) || days[0]; d.enabled = false; d.is_open = false; d.open = false; }
  const v4 = (await read()).version; const r5 = await put(JSON.stringify(bad), v4); out.brokenRefused = r5.s + ' ' + r5.t.slice(0, 200);
} finally {
  const cur = await read(); const rr = await put(O, cur.version); out.restore = rr.s + ' ' + (rr.s > 299 ? rr.t.slice(0, 200) : ''); out.restoredEqual = JSON.stringify((await read()).value_json) === JSON.stringify(O);
}
return out;

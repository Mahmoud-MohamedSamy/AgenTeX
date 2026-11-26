// Expected-value check: every formula field on all 4 records vs what the function should give for the input as the user sees it.
const R = JSON.parse(fs.readFileSync(RUN + '/out/records2.json', 'utf8'));
const FN = ['if', 'concat', 'coalesce', 'min', 'max', 'sum', 'avg', 'count', 'upper', 'lower', 'trim', 'len', 'abs', 'round', 'isblank', 'number', 'text', 'daysbetween', 'hoursbetween'];
const T = ['single_line', 'multi_line', 'rich_text', 'email', 'phone', 'url', 'number', 'decimal', 'currency', 'percent', 'long_integer', 'auto_number', 'checkbox', 'pick_list', 'radio_button', 'status', 'multi_select', 'date', 'date_time', 'lookup', 'user', 'address', 'location', 'file_upload', 'camera', 'image_upload', 'map', 'multi_select_lookup', 'department', 'team', 'support_plan', 'email_template', 'subform'];
const L1 = new Set(['if', 'concat', 'coalesce', 'min', 'max', 'sum', 'avg', 'count', 'upper', 'lower']);
// display names for reference types
const mods = L((await api('GET', '/modules')).j?.data); const ACC = mods.find(m => m.moduleKey === 'accounts').id;
const nameOf = {};
const accRec = await getRec(ACC, made.acc); nameOf[made.acc] = accRec.account_name || accRec.name;
for (const u of L((await api('GET', '/iam/users?limit=200')).j?.data)) nameOf[u.id] = u.display_name || u.full_name || u.name || [u.first_name, u.last_name].filter(Boolean).join(' ');
for (const d of L((await api('GET', '/desk/departments?limit=100')).j?.data)) nameOf[d.id] = d.name;
for (const t of L((await api('GET', '/mail/templates?limit=100')).j?.data)) nameOf[t.id] = t.name;
const NUMT = new Set(['number', 'decimal', 'currency', 'percent', 'long_integer']);
const FUZZY = new Set(['multi_select', 'address', 'location', 'map', 'file_upload', 'image_upload', 'camera', 'multi_select_lookup']);
const REF = new Set(['lookup', 'user', 'department', 'email_template']);
const isBlankRaw = v => v === null || v === undefined || (typeof v === 'string' && v.trim() === '') || (Array.isArray(v) && !v.length);
// the input as the user sees it
const view = (t, raw) => {
  const b = isBlankRaw(raw); const o = { blank: b, num: null, txt: b ? '' : null, token: null };
  if (b) return o;
  if (NUMT.has(t)) { o.num = Number(raw); o.txt = String(raw); }
  else if (t === 'checkbox') { o.num = raw ? 1 : 0; o.txt = String(raw); }
  else if (t === 'date') { o.txt = raw; o.date = Date.parse(raw + 'T00:00:00Z'); }
  else if (t === 'date_time') { o.date = Date.parse(raw); const c = new Date(o.date + 2 * 3600e3).toISOString(); o.txt = null; o.token = c.slice(11, 16); o.utc = raw; } // Cairo UTC+2
  else if (REF.has(t)) { o.txt = nameOf[raw] || null; o.token = nameOf[raw] || '?name'; o.id = raw; }
  else if (t === 'multi_select') o.token = raw[0];
  else if (t === 'multi_select_lookup') o.token = nameOf[raw[0]] || '?name';
  else if (t === 'address') o.token = 'Cairo';
  else if (t === 'location' || t === 'map') o.token = '30.04';
  else if (t === 'file_upload' || t === 'image_upload') o.token = raw.filename;
  else if (t === 'camera') o.token = raw[0].filename;
  else o.txt = String(raw);
  if (o.txt === null && !o.token) o.token = '?';
  return o; };
const near = (a, b) => typeof a === 'number' && typeof b === 'number' && Math.abs(a - b) < 1e-6;
const eq = (a, b) => a === b || near(a, b) || (typeof b === 'number' && typeof a === 'string' && a !== '' && near(Number(a), b));
// expected: list of acceptable values, or a predicate
const expect = (f, t, v, rec) => {
  const tx = v.txt; const tok = v.token; const has = s => typeof s === 'string' && tok && s.toLowerCase().includes(String(tok).toLowerCase());
  const textLike = (fnOut) => tx !== null ? [fnOut(tx)] : (s => has(s));
  const nul = [null, undefined];
  switch (f) {
    case 'if': return [v.blank ? 'empty' : 'set'];
    case 'concat': return tx !== null ? ['[' + tx + ']'] : (s => typeof s === 'string' && s.startsWith('[') && has(s));
    case 'coalesce': return v.blank ? ['none'] : textLike(x => x);
    case 'min': return v.num !== null ? [Math.min(v.num, 100)] : v.blank ? [100] : nul;
    case 'max': return v.num !== null ? [Math.max(v.num, 0)] : v.blank ? [0] : nul;
    case 'sum': return v.num !== null ? [v.num + 1] : v.blank ? [1] : nul;
    case 'avg': return v.num !== null ? [(v.num + 0) / 2] : v.blank ? [0] : nul;
    case 'count': return v.blank ? [0] : t === 'multi_select' ? [1, (rec['in_' + t] || []).length] : [1];
    case 'upper': return v.blank ? ['', null] : tx !== null ? [tx.toUpperCase()] : (s => has(s) && s === s.toUpperCase());
    case 'lower': return v.blank ? ['', null] : tx !== null ? [tx.toLowerCase()] : (s => has(s) && s === s.toLowerCase());
    case 'trim': return v.blank ? ['', null] : textLike(x => x.trim());
    case 'len': return v.blank ? [0] : tx !== null ? [tx.length] : (n => typeof n === 'number' && n > 0);
    case 'abs': return v.num !== null ? [Math.abs(v.num)] : v.blank ? [null, 0] : nul;
    case 'round': return v.num !== null ? [Math.round(v.num * 10) / 10] : v.blank ? [null, 0] : nul;
    case 'isblank': return [v.blank];
    case 'number': return v.num !== null ? [v.num] : v.blank ? [null, 0] : nul;
    case 'text': return v.blank ? ['', null] : textLike(x => x);
    case 'daysbetween': { const d = rec.in_date ? Date.parse(rec.in_date + 'T00:00:00Z') : null; if (!v.date || d === null) return [null, 0]; return [Math.round((d - v.date) / 864e5), Math.round((d - 2 * 3600e3 - v.date) / 864e5)]; }
    case 'hoursbetween': { const d = rec.in_date_time ? Date.parse(rec.in_date_time) : null; if (!v.date || d === null) return [null, 0]; return [Math.round((d - v.date) / 36e5), Math.round((d - (v.date - 2 * 3600e3)) / 36e5)]; }
  } };
const subExpect = (f, rec) => { const rows = rec.in_subform || []; const pr = rows.map(r => r.price).filter(x => x != null); const s = pr.reduce((a, b) => a + b, 0);
  const st = String(s), d = rec.in_date, dt = rec.in_date_time, nul = [null, undefined];
  return { if: ['set'], concat: ['[' + st + ']'], coalesce: [st, s], min: pr.length ? [Math.min(...pr)] : nul, max: pr.length ? [Math.max(...pr)] : nul, sum: [s], avg: pr.length ? [s / pr.length] : nul, count: [rows.length],
    upper: [st], lower: [st], trim: [st], len: [st.length], abs: [Math.abs(s)], round: [Math.round(s * 10) / 10], isblank: [false], number: [s], text: [st], daysbetween: d ? [0] : [null, 0], hoursbetween: dt ? [0] : [null, 0] }[f]; };
// known bugs
const known = (f, t, v, act) => {
  const s = typeof act === 'string' ? act : JSON.stringify(act);
  if (REF.has(t) && v.id && s && s.toLowerCase().includes(String(v.id).toLowerCase().slice(0, 8))) return 'NDC-3220 shows id instead of name';
  if (FUZZY.has(t) && !v.blank && (act === 'empty' || act === true || act === '[]' || act === 'none' || act === '' || act === 0 || act === 1 || act === null)) return 'NDC-3221 value read as empty' + (['map', 'file_upload', 'image_upload', 'camera'].includes(t) ? ' (also this type)' : '');
  if (t === 'date_time' && /t\d\d:\d\d:\d\dz/i.test(s || '')) return 'NDC-3224 date-time shown in UTC';
  if (t === 'user' && !v.blank && (act === 'empty' || act === true || act === '[]' || act === 'none' || act === '' || act === 0 || act === 1)) return 'NEW default User value not seen by formulas';
  if (REF.has(t) && f === 'len' && act === String(v.id).length) return 'NDC-3220 shows id instead of name';
  if (f === 'coalesce' && typeof act !== 'string' && eq(String(act), v.txt)) return 'NDC-3222 return type not enforced (number/boolean instead of text)';
  if (f === 'min' && v.blank && act === 0) return 'NDC-3225 empty counted as 0 in min()';
  return null; };
const rows = [];
for (const [rk, r] of Object.entries(R)) {
  const rec = r.values; const layout = /2$/.test(rk) ? 2 : 1;
  for (const f of FN) for (const t of T) {
    const field = `fx_${f}_${t}`; if (!(field in rec) && !Object.keys(rec).some(k => k === field)) { rows.push({ rec: rk, f, t, field, verdict: 'MISSING' }); continue; }
    const act = rec[field]; const v = view(t, rec['in_' + t]);
    const ex = t === 'subform' ? subExpect(f, rec) : expect(f, t, v, rec);
    const ok = typeof ex === 'function' ? ex(act) : ex.some(e => eq(act, e) || (e == null && act == null));
    const kb = ok ? null : known(f, t, v, act);
    rows.push({ rec: rk, layoutOfFn: L1.has(f) ? 1 : 2, f, t, input: v.blank ? '(blank)' : (rec['in_' + t]), actual: act, expected: typeof ex === 'function' ? 'contains ' + v.token : ex, verdict: ok ? 'PASS' : kb ? (kb.startsWith('NEW') ? 'FAIL new' : 'FAIL known') : 'FAIL new', bug: kb || '' });
  } }
fs.writeFileSync(RUN + '/out/check.json', JSON.stringify(rows, null, 1));
const cnt = {}; for (const x of rows) cnt[x.verdict] = (cnt[x.verdict] || 0) + 1;
const byBug = {}; for (const x of rows.filter(x => x.bug)) byBug[x.bug] = (byBug[x.bug] || 0) + 1;
log({ total: rows.length, cnt, byBug });
for (const x of rows.filter(x => x.verdict === 'FAIL new')) log('NEW', x.rec, x.f, x.t, 'in=', JSON.stringify(x.input).slice(0, 60), 'act=', JSON.stringify(x.actual).slice(0, 60), 'exp=', JSON.stringify(x.expected).slice(0, 60));

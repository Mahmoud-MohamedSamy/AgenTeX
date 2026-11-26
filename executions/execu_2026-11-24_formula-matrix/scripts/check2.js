// Generic expected-value check. env FILE=recs-<app>-<spec>.json SPEC=matrix|ops DESK=1. Out: out/check-<app>-<spec>.json
const SPEC = process.env.SPEC || 'matrix', isDesk = !!process.env.DESK, app = isDesk ? 'desk' : 'crm';
const R = JSON.parse(fs.readFileSync(RUN + '/out/' + (process.env.FILE || `recs-${app}-${SPEC}.json`), 'utf8'));
const FNM = ['if', 'concat', 'coalesce', 'min', 'max', 'sum', 'avg', 'count', 'upper', 'lower', 'trim', 'len', 'abs', 'round', 'isblank', 'number', 'text', 'daysbetween', 'hoursbetween'];
const FNO = ['add', 'sub', 'mul', 'div', 'mod', 'amp', 'eq', 'ne', 'gt', 'ge', 'lt', 'le', 'and', 'or', 'not', 'iftruthy', 'cnum', 'cif', 'ccoal', 'cnest', 'cnum2', 'clen', 'ccnt', 'cmix'];
const FN = SPEC === 'ops' ? FNO : FNM;
const T = ['single_line', 'multi_line', 'rich_text', 'email', 'phone', 'url', 'number', 'decimal', 'currency', 'percent', 'long_integer', 'auto_number', 'checkbox', 'pick_list', 'radio_button', 'status', 'multi_select', 'date', 'date_time', 'lookup', 'user', 'address', 'location', 'file_upload', 'camera', 'image_upload', 'map', 'multi_select_lookup', 'department', 'team', 'support_plan', 'email_template', 'subform'];
const nameOf = {};
const mods = L((await api('GET', '/modules')).j?.data); const ACC = mods.find(m => m.moduleKey === (isDesk ? 'desk_accounts' : 'accounts')).id;
for (const id of [made.acc2, made.acc].filter(Boolean)) { const a = await getRec(ACC, id).catch(() => ({})); nameOf[id] = a.account_name || a.name; }
for (const u of L((await api('GET', '/iam/users?limit=200')).j?.data)) nameOf[u.id] = u.display_name || u.full_name || u.name || [u.first_name, u.last_name].filter(Boolean).join(' ') || u.email;
for (const d of L((await api('GET', '/desk/departments?limit=100', undefined, { app: 'desk' })).j?.data)) nameOf[d.id] = d.name;
for (const t of L((await api('GET', '/mail/templates?limit=100')).j?.data)) nameOf[t.id] = t.name;
for (const p of L((await api('GET', '/desk/sla/support-plans?limit=100', undefined, { app: 'desk' })).j?.data)) nameOf[p.id] = p.name;
const NUMT = new Set(['number', 'decimal', 'currency', 'percent', 'long_integer']);
const FUZZY = new Set(['multi_select', 'address', 'location', 'map', 'file_upload', 'image_upload', 'camera', 'multi_select_lookup']);
const REF = new Set(['lookup', 'user', 'department', 'email_template', 'team', 'support_plan']);
const DATEISH = new Set(['date', 'date_time']);
const isBlankRaw = v => v === null || v === undefined || (typeof v === 'string' && v.trim() === '') || (Array.isArray(v) && !v.length);
const cairo = ms => { const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Cairo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date(ms)).map(x => [x.type, x.value])); return { day: `${p.year}-${p.month}-${p.day}`, hm: `${p.hour === '24' ? '00' : p.hour}:${p.minute}` }; };
const view = (t, raw) => {
  const b = isBlankRaw(raw); const o = { blank: b, num: null, txt: b ? '' : null, token: null };
  if (b) return o;
  if (NUMT.has(t)) { o.num = Number(raw); o.txt = String(raw); }
  else if (t === 'checkbox') { o.num = raw ? 1 : 0; o.txt = String(raw); }
  else if (t === 'date') { o.txt = raw; o.date = Date.parse(raw + 'T00:00:00Z'); }
  else if (t === 'date_time') { o.date = Date.parse(raw); const c = cairo(o.date); o.token = c.hm; o.cairoDay = c.day; }
  else if (REF.has(t)) { o.txt = nameOf[raw] || null; o.token = nameOf[raw] || '?name'; o.id = raw; }
  else if (t === 'multi_select') o.token = raw[0];
  else if (t === 'multi_select_lookup') o.token = nameOf[raw[0]] || '?name';
  else if (t === 'address') o.token = raw.city || raw.street;
  else if (t === 'location' || t === 'map') o.token = String(raw.lat);
  else if (t === 'file_upload' || t === 'image_upload') o.token = raw.filename;
  else if (t === 'camera') o.token = raw[0].filename;
  else o.txt = String(raw);
  if (o.txt === null && !o.token) o.token = '?';
  return o; };
const near = (a, b) => typeof a === 'number' && typeof b === 'number' && Math.abs(a - b) < 1e-6 * Math.max(1, Math.abs(b));
const eq = (a, b) => a === b || near(a, b) || (typeof b === 'number' && typeof a === 'string' && a !== '' && near(Number(a), b));
const NOTE = { note: true }; const rhz = x => Math.sign(x) * Math.round(Math.abs(x));
const hasTok = (s, tok) => typeof s === 'string' && tok && s.toLowerCase().includes(String(tok).toLowerCase());
const subVals = rec => { const rows = rec.in_subform || []; const pr = rows.map(r => r.price).filter(x => x != null); return { rows, pr, s: pr.reduce((a, b) => a + b, 0) }; };
const expectM = (f, t, v, rec) => {
  const tx = v.txt; const has = s => hasTok(s, v.token); const textLike = fo => tx !== null ? [fo(tx)] : (s => has(s)); const nul = [null, undefined];
  switch (f) {
    case 'if': return [v.blank ? 'empty' : 'set'];
    case 'concat': return tx !== null ? ['[' + tx + ']'] : (s => typeof s === 'string' && s.startsWith('[') && has(s));
    case 'coalesce': return v.blank ? ['none'] : textLike(x => x);
    case 'min': return v.num !== null ? [Math.min(v.num, 100)] : v.blank ? [100] : nul;
    case 'max': return v.num !== null ? [Math.max(v.num, 0)] : v.blank ? [0] : nul;
    case 'sum': return v.num !== null ? [v.num + 1] : v.blank ? [1] : nul;
    case 'avg': return v.num !== null ? [(v.num + 0) / 2] : v.blank ? [0] : nul;
    case 'count': return v.blank ? [0] : (t === 'multi_select' || t === 'camera' || t === 'multi_select_lookup') ? [1, (rec['in_' + t] || []).length] : [1];
    case 'upper': return v.blank ? ['', null] : tx !== null ? [tx.toUpperCase()] : (s => has(s) && s === s.toUpperCase());
    case 'lower': return v.blank ? ['', null] : tx !== null ? [tx.toLowerCase()] : (s => has(s) && s === s.toLowerCase());
    case 'trim': return v.blank ? ['', null] : textLike(x => x.trim());
    case 'len': return v.blank ? [0] : tx !== null ? [tx.length, [...tx].length] : (n => typeof n === 'number' && n > 0);
    case 'abs': return v.num !== null ? [Math.abs(v.num)] : v.blank ? [null, 0] : nul;
    case 'round': return v.num !== null ? [Math.sign(v.num) * Math.round(Math.abs(v.num) * 10) / 10] : v.blank ? [null, 0] : nul;
    case 'isblank': return [v.blank];
    case 'number': return v.num !== null ? [v.num] : v.blank ? [null, 0] : nul;
    case 'text': return v.blank ? ['', null] : textLike(x => x);
    case 'daysbetween': { const d = rec.in_date ? Date.parse(rec.in_date + 'T00:00:00Z') : null; if (v.date == null || d === null) return [null, 0]; return [rhz((d - v.date) / 864e5), rhz((d - 2 * 3600e3 - v.date) / 864e5)]; }
    case 'hoursbetween': { const d = rec.in_date_time ? Date.parse(rec.in_date_time) : null; if (v.date == null || d === null) return [null, 0]; return [rhz((d - v.date) / 36e5), rhz((d - (v.date - 2 * 3600e3)) / 36e5)]; }
  } };
const subM = (f, rec) => { const { rows, pr, s } = subVals(rec); const st = String(s), nul = [null, undefined];
  return { if: ['set'], concat: ['[' + st + ']'], coalesce: [st, s], min: pr.length ? [Math.min(...pr)] : nul, max: pr.length ? [Math.max(...pr)] : nul, sum: [s], avg: pr.length ? [s / pr.length] : nul, count: [rows.length],
    upper: [st], lower: [st], trim: [st], len: [st.length], abs: [Math.abs(s)], round: [Math.sign(s) * Math.round(Math.abs(s) * 10) / 10], isblank: [false], number: [s], text: [st], daysbetween: rec.in_date ? [0] : [null, 0], hoursbetween: rec.in_date_time ? [0] : [null, 0] }[f]; };
// operators. X for subform = sum(price). Blank counts as 0 in arithmetic (engine rule, E7).
const expectO = (f, t, v, rec) => {
  const sub = t === 'subform'; if (sub) { const s = subVals(rec).s; Object.assign(v, { blank: false, num: s, txt: String(s), token: null }); }
  const n = v.num !== null ? v.num : v.blank ? 0 : null; const tx = v.txt; const has = s => hasTok(s, v.token); const nul = [null, undefined];
  const numRec = rec.in_number; const numTxt = numRec == null ? '' : String(numRec);
  switch (f) {
    case 'add': return n !== null ? [n + 1] : DATEISH.has(t) ? NOTE : nul;
    case 'sub': return n !== null ? [n - 1] : DATEISH.has(t) ? NOTE : nul;
    case 'mul': return n !== null ? [n * 2] : nul;
    case 'div': return n !== null ? [n / 2] : nul;
    case 'mod': return n !== null ? [n % 3, ((n % 3) + 3) % 3] : nul;
    case 'amp': return tx !== null ? [tx + '!'] : (s => typeof s === 'string' && s.endsWith('!') && has(s));
    case 'eq': case 'ge': case 'le': return v.blank ? [true, false, null] : [true];
    case 'ne': case 'gt': case 'lt': return v.blank ? [false, null] : [false];
    case 'and': case 'or': case 'not': case 'iftruthy': return NOTE;
    case 'cnum': return tx !== null ? [tx + '|' + numTxt] : (s => typeof s === 'string' && has(s) && s.endsWith('|' + numTxt));
    case 'cif': return rec.in_checkbox ? (v.blank ? ['', null] : tx !== null ? [tx, v.num] : (s => has(s))) : ['off'];
    case 'ccoal': return v.blank ? (isBlankRaw(rec.in_single_line) ? [null, ''] : [rec.in_single_line]) : tx !== null ? [tx, v.num] : (s => has(s));
    case 'cnest': return v.blank ? ['', null] : tx !== null ? [tx.trim().toUpperCase()] : (s => has(s) && s === s.toUpperCase());
    case 'cnum2': return v.num !== null ? [Math.round(Math.abs(v.num) * 2)] : [0, null];
    case 'clen': return [!v.blank];
    case 'ccnt': return [(v.blank ? 0 : 1) + (numRec == null ? 0 : 1)];
    case 'cmix': { const d = rec.in_date ?? '', c = rec.in_checkbox == null ? '' : String(rec.in_checkbox); return tx !== null ? [`${tx} / ${d} / ${c}`] : (s => typeof s === 'string' && s.endsWith(` / ${d} / ${c}`) && (v.blank || has(s))); }
  } };
const known = (f, t, v, act) => {
  const s = typeof act === 'string' ? act : JSON.stringify(act);
  if (REF.has(t) && v.id && s && s.toLowerCase().includes(String(v.id).toLowerCase().slice(0, 8))) return 'NDC-3220 shows id instead of name';
  if (REF.has(t) && v.id && typeof act === 'number' && (act === String(v.id).length || act === 36)) return 'NDC-3220 shows id instead of name';
  if (FUZZY.has(t) && !v.blank) return 'NDC-3221 value read as empty' + (['map', 'file_upload', 'image_upload', 'camera'].includes(t) ? ' (also this type)' : '');
  if (t === 'date_time' && /t\d\d:\d\d(:\d\d)?(\.\d+)?z/i.test(s || '')) return 'NDC-3224 date-time shown in UTC';
  if (t === 'user' && !v.blank && (act === 'empty' || act === true || act === false || act === '[]' || act === 'none' || act === '' || act === 0 || act === 1 || act === 'off')) return 'NEW default User value not seen by formulas';
  if (['coalesce', 'cif', 'ccoal'].includes(f) && typeof act !== 'string' && act !== null && eq(String(act), v.txt)) return 'NDC-3222 return type not enforced (number/boolean instead of text)';
  if (['add'].includes(f) && typeof act === 'string') return 'NDC-3222 return type not enforced (+ on text gives text)';
  if (f === 'min' && v.blank && act === 0) return 'NDC-3225 empty counted as 0 in min()';
  return null; };
const rows = []; const truth = {};
for (const [rk, r] of Object.entries(R)) { const rec = r.values;
  for (const f of FN) for (const t of T) {
    const field = `fx_${f}_${t}`; if (!(field in rec)) { rows.push({ rec: rk, f, t, field, verdict: 'MISSING' }); continue; }
    const act = rec[field]; const v = view(t, rec['in_' + t]);
    const rawIn = rec['in_' + t]; if (typeof rawIn === 'string' && rawIn.trim() === '' && !['isblank', 'if'].includes(f)) { rows.push({ rec: rk, f, t, input: JSON.stringify(rawIn), actual: act, expected: '(empty or spaces-only text — recorded)', verdict: 'NOTE', bug: '', emptyText: true }); continue; }
    const ex = SPEC === 'ops' ? expectO(f, t, v, rec) : (t === 'subform' ? subM(f, rec) : expectM(f, t, v, rec));
    if (ex === NOTE) { rows.push({ rec: rk, f, t, input: v.blank ? '(blank)' : rec['in_' + t], actual: act, expected: '(no rule — recorded)', verdict: 'NOTE', bug: '' }); if (['and', 'or', 'not', 'iftruthy'].includes(f)) ((truth[rk] ||= {})[t] ||= {})[f] = act; continue; }
    const ok = typeof ex === 'function' ? ex(act) : ex.some(e => eq(act, e) || (e == null && act == null));
    const kb = ok ? null : known(f, t, v, act);
    rows.push({ rec: rk, f, t, input: v.blank ? '(blank)' : rec['in_' + t], actual: act, expected: typeof ex === 'function' ? 'contains ' + v.token : ex, verdict: ok ? 'PASS' : kb ? (kb.startsWith('NEW') ? 'FAIL new' : 'FAIL known') : 'FAIL new', bug: kb || '' });
  } }
// truthiness consistency (ops): and == or, not == !and, iftruthy matches and
const incons = []; for (const [rk, ts] of Object.entries(truth)) for (const [t, o] of Object.entries(ts)) { const a = o.and, b = o.or, n = o.not, i = o.iftruthy;
  const bad = (a !== b) || (n !== null && a !== null && n === a) || (i != null && a != null && i !== (a ? 'truthy' : 'falsy')); if (bad) incons.push({ rec: rk, t, and: a, or: b, not: n, iftruthy: i }); }
fs.writeFileSync(RUN + `/out/check-${app}-${SPEC}${process.env.FILE ? '-' + process.env.FILE.replace(/.json$/, '') : ''}.json`, JSON.stringify({ rows, truth, incons }, null, 1));
const cnt = {}; for (const x of rows) cnt[x.verdict] = (cnt[x.verdict] || 0) + 1; const byBug = {}; for (const x of rows.filter(x => x.bug)) byBug[x.bug] = (byBug[x.bug] || 0) + 1;
log({ app, SPEC, total: rows.length, cnt, byBug, truthInconsistent: incons.length });
const nw = rows.filter(x => x.verdict === 'FAIL new' && !x.bug); const grp = {}; for (const x of nw) { const k = x.f + ' x ' + x.t; (grp[k] ||= []).push(x.rec + ': in=' + JSON.stringify(x.input).slice(0, 40) + ' act=' + JSON.stringify(x.actual).slice(0, 50) + ' exp=' + JSON.stringify(x.expected).slice(0, 50)); }
for (const [k, l] of Object.entries(grp)) log('NEW', k, '|', l.join(' || '));

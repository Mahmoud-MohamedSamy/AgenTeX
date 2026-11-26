// Compare Zoho pair results (zoho/pairs.json) with TAVI (out/recs-crm-matrix.json, out/recs-crm-ops.json). Out: zoho/compare.json + zoho/compare.md
const fs = require('fs'), path = require('path'); const RUN = path.join(__dirname, '..'); const J = p => JSON.parse(fs.readFileSync(path.join(RUN, p), 'utf8'));
const Z = J('zoho/pairs.json'), made = J('zoho/made.json'); const TM = J('out/recs-crm-matrix.json'), TO = J('out/recs-crm-ops.json');
const OPMAP = { op_add: 'add', op_sub: 'sub', op_mul: 'mul', op_div: 'div', op_mod: 'mod', op_eq: 'eq', op_ne: 'ne', op_gt: 'gt', op_ge: 'ge', op_lt: 'lt', op_le: 'le', op_and: 'and', op_or: 'or', op_not: 'not', op_plus_text: 'add' };
const tavi = (fn, t, k) => { const src = fn.startsWith('op_') ? TO : TM; const f = fn.startsWith('op_') ? OPMAP[fn] : fn; const rec = src[k === 'full' ? 'rFull' : 'rEmpty']; return rec?.values?.['fx_' + f + '_' + t]; };
const norm = v => { if (v === null || v === undefined || v === '') return '∅'; if (typeof v === 'boolean') return String(v); if (typeof v === 'number') return String(Math.round(v * 1e6) / 1e6);
  if (typeof v === 'string' && /^-?\d+(\.\d+)?$/.test(v.trim())) return String(Math.round(Number(v) * 1e6) / 1e6); if (typeof v === 'object') return JSON.stringify(v); return String(v); };
const rows = [];
for (const [key, z] of Object.entries(Z)) { const [fn, , t] = key.split(' '); const row = { fn, t, zohoAccepted: z.accepted === null ? 'no function' : !!z.accepted, zohoError: z.accepted ? '' : (z.tries || []).join(' ; '), expr: z.expr || '' };
  row.taviFull = tavi(fn, t, 'full'); row.taviEmpty = tavi(fn, t, 'empty'); row.zohoFull = z.values?.full; row.zohoEmpty = z.values?.empty;
  if (z.accepted === null) row.verdict = 'TAVI only (Zoho has no such function)';
  else if (!z.accepted) row.verdict = 'Zoho refuses — TAVI accepts';
  else if (fn === 'op_plus_text' || fn === 'daysbetween' || fn === 'hoursbetween') row.verdict = 'both accept (different expression — value not compared)';
  else { const sf = norm(row.taviFull) === norm(row.zohoFull), se = norm(row.taviEmpty) === norm(row.zohoEmpty); row.sameFull = sf; row.sameEmpty = se; row.verdict = sf && se ? 'same result' : 'different result'; }
  rows.push(row); }
const cnt = {}; rows.forEach(r => cnt[r.verdict] = (cnt[r.verdict] || 0) + 1);
fs.writeFileSync(path.join(RUN, 'zoho/compare.json'), JSON.stringify({ cnt, rows }, null, 1));
const d = rows.filter(r => r.verdict === 'different result'); console.log(JSON.stringify(cnt));
console.log('Zoho-refused types per function:'); const byFn = {}; rows.filter(r => r.verdict.startsWith('Zoho refuses')).forEach(r => (byFn[r.fn] ||= []).push(r.t)); for (const [f, l] of Object.entries(byFn)) console.log(' ', f, ':', l.join(', '));
console.log('Different results:'); for (const r of d) console.log(' ', r.fn, r.t, '| TAVI', JSON.stringify(r.taviFull), '/', JSON.stringify(r.taviEmpty), '| Zoho', JSON.stringify(r.zohoFull), '/', JSON.stringify(r.zohoEmpty));

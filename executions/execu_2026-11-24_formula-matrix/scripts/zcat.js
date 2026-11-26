const fs = require('fs'); const C = JSON.parse(fs.readFileSync('zoho/compare.json', 'utf8')); const rows = C.rows.filter(r => r.verdict === 'different result' || r.verdict === 'same result');
const n2 = v => typeof v === 'number' ? Math.round(v * 100) / 100 : (typeof v === 'string' && /^-?\d+(\.\d+)?$/.test(v) ? Math.round(Number(v) * 100) / 100 : v);
const blank = v => v === null || v === undefined || v === '';
const cat = r => { const out = [];
  for (const k of ['Full', 'Empty']) { const tv = r['tavi' + k], zv = r['zoho' + k]; if (JSON.stringify(n2(tv)) === JSON.stringify(n2(zv)) || (blank(tv) && blank(zv))) continue;
    if (r.t === 'auto_number') { out.push('auto-number sequence (not a formula difference)'); continue; }
    if (r.t === 'single_line' && k === 'Full' && typeof zv === 'string' && typeof tv === 'string' && tv.trim().toUpperCase() === zv.trim().toUpperCase()) { out.push('Zoho trims spaces when the field is saved (input, not formula)'); continue; }
    if (r.t === 'single_line' && k === 'Full' && r.fn === 'len' && zv === 11) { out.push('Zoho trims spaces when the field is saved (input, not formula)'); continue; }
    if (k === 'Empty' && r.t === 'checkbox') { out.push('empty checkbox: Zoho = false, TAVI = blank'); continue; }
    if (k === 'Empty' && blank(zv)) { out.push('empty input: Zoho gives blank, TAVI gives ' + (typeof tv === 'boolean' ? 'true/false' : tv === 0 ? '0' : JSON.stringify(tv))); continue; }
    if (k === 'Empty' && r.fn === 'min') { out.push('min(empty,100): Zoho 100, TAVI 0 (NDC-3225)'); continue; }
    if (['user', 'lookup'].includes(r.t)) { out.push('Zoho uses the name, TAVI the id (NDC-3220)'); continue; }
    if (r.t === 'multi_select') { out.push('Zoho reads "A;C", TAVI empty (NDC-3221)'); continue; }
    if (r.t === 'date' && k === 'Full') { out.push('date as text: Zoho org format 24/11/2026, TAVI 2026-11-24'); continue; }
    if (r.t === 'date_time' && k === 'Full') { out.push('date-time as text: Zoho "24/11/2026 11:30 PM" (local), TAVI raw UTC (NDC-3224)'); continue; }
    out.push(`other: ${k} TAVI ${JSON.stringify(tv)} vs Zoho ${JSON.stringify(zv)}`); }
  return [...new Set(out)]; };
const agg = {}; const real = { same: 0 }; for (const r of rows) { const c = cat(r); r.causes = c; if (!c.length) real.same++; for (const x of c) (agg[x] ||= []).push(r.fn + '·' + r.t); }
console.log('pairs both accept (value compared):', rows.length, '| same after removing input differences:', real.same);
for (const [k, l] of Object.entries(agg).sort((a, b) => b[1].length - a[1].length)) console.log(String(l.length).padStart(3), k, '|', l.slice(0, 12).join(', '), l.length > 12 ? '…' : '');
fs.writeFileSync('zoho/compare-cats.json', JSON.stringify({ rows, agg }, null, 1));

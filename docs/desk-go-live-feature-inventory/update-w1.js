// One-off: apply Wave 1 results (2 Nov 2026) to matrix-data.js, rewriting the whole file from the parsed rows.
const fs = require('fs');
const rows = require('./matrix-data.js');
const by = Object.fromEntries(rows.map(r => [r[0], r]));
const fix = (id, ev, pl) => { const r = by[id]; if (!r) throw new Error('no row ' + id); if (ev != null) r[5] = ev; if (pl != null) r[6] = pl; };
fix('O-01', '/settings/organization/company — Wave 1: validation bug (NDC-2776), audit time zone bug (NDC-2779)', 'NDC-1970, NDC-2776, NDC-2779');
fix('O-03', '/settings/organization/business-hours — Wave 1: two blocks per day work; a block past midnight is refused ("slots cannot cross midnight")', null);
fix('O-05', '/settings/organization/departments — Wave 1: lost update between two admins (NDC-2777)', 'NDC-2733, NDC-2777');
fix('A-01', "/settings/users-control/agents — Wave 1 (NDC): invite/resend/cancel pass; inviting an active user's email makes a 2nd user (NDC-2778)", 'NDC-2736, NDC-2778');
fix('A-03', '/settings/users-control/profiles — Wave 1: NDC-2305 passes; built-in profile rename refused', 'NDC-2305 (passes), NDC-2702');
fix('A-06', '/settings/users-control/ticket-access — Wave 1: NDC-2303 fixed (Done 2 Nov)', 'NDC-2303 (Done), NDC-2196, NDC-2376');
fix('A-07', 'Modules and Fields › field permissions — Wave 1: NDC-2387 fixed (Done 2 Nov)', 'NDC-2387 (Done)');
fix('A-09', '/settings/security/audit-log — Wave 1: every write logged; company save logs a false time zone change (NDC-2779)', 'NDC-2511, NDC-2779');
for (const id of ['O-07', 'A-08', 'A-11', 'T-39', 'T-42', 'U-10', 'U-11', 'N-13', 'N-14', 'N-15', 'N-16', 'N-17', 'X-04', 'G-05']) {
  const r = by[id]; if (!/NDC-2760/.test(r[6])) r[6] = (r[6] && r[6] !== '—' ? r[6] + ', ' : '') + 'NDC-2760';
}
const src = fs.readFileSync('matrix-data.js', 'utf8');
const header = src.slice(0, src.indexOf('module.exports'));
const q = v => typeof v === 'number' ? String(v) : "'" + String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
fs.writeFileSync('matrix-data.js', header + 'module.exports = [\n' + rows.map(r => '[' + r.map(q).join(',') + '],').join('\n') + '\n];\n');
console.log('rows', rows.length);

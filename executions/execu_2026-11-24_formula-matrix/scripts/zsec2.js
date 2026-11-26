const fs = require('fs'), path = require('path'); const RUN = path.join(__dirname, '..');
const rows = [
 ['Formula reads another formula', 'Refused (DATATYPE_FORMULA_CHAIN_UNSUPPORTED)', 'Refused: "Formula Field(s) cannot be used inside another formula field"', 'Same — the NDC-3229 item "formulas using formulas" is not a Zoho feature'],
 ['Formula added to a module with records', 'Existing records stay empty', 'Existing records stay empty', 'Same — this part of NDC-3219 matches Zoho'],
 ['Expression edited', 'Existing records keep the old value until saved again', 'Existing records keep the old value (8 after 60 s); new records use the new expression (15)', 'Same — this part of NDC-3219 matches Zoho'],
 ['Record edited', 'Recalculated', 'Recalculated', 'Same'],
 ['Pick-list option renamed (Red → Crimson) used in a formula', 'Formula keeps "Red", silently gives "other"', 'Formula keeps "Red", gives "other"; the record shows Crimson', 'Same — the formula part of NDC-3227 matches Zoho'],
 ['Delete a field that a formula uses', 'Deleted (204); formula breaks silently', 'Refused: "The custom field has already used in other places"', 'Different — NDC-3218 confirmed'],
 ['Type checking when saving', 'None — every pair saves', 'Strict — 431 of 748 pairs refused', 'Different (new parity item)'],
 ['Empty input', 'Counts as 0 / "" / true-false', 'Result blank (Abs, Len, *, /, comparisons); + still adds (empty+1 = 1); min(empty,100) = 100', 'Different'],
 ['1 / 0', 'Blank', '0', 'Different (TAVI blank is safer)'],
 ['Lookup / User in text', 'Record id', 'Name', 'Different — NDC-3220'],
 ['Multi-select', 'Empty', '"A;C"', 'Different — NDC-3221'],
 ['Date / date-time as text', 'ISO / raw UTC', 'Org date format / local time', 'Different — NDC-3224 + format'],
 ['Text joined with +', 'Joins ("Green1", "2026-11-241")', 'Refused', 'Different — new bug 3'],
 ['Error messages (server)', 'Specific: "Unknown function \'x\' at position 0. Available: …"', 'Generic: "invalid data", "Formula expression has syntax error"', 'TAVI is clearer (builder shows them raw — NDC-3226)'],
 ['Limits', '2,000 characters, 32 nesting levels, 512 tokens', '2,001 characters and 33 nesting levels accepted', 'Close'],
 ['Formula fields per module', 'No limit seen (792)', '≈ 20 per return type', 'TAVI extra'],
 ['Return type', 'Not enforced (NDC-3222)', 'Chosen and enforced', 'Different'],
 ['Workflow field update changes an input', 'Formulas recalculated (24 Nov)', 'Formulas recalculated (Num 1→7, formula 14)', 'Same'],
 ['Filter on a number / boolean formula', 'Works (list filters, 24 Nov)', 'Works (query F1 > 10 → 20, 28)', 'Same'],
 ['Filter on a text formula', 'Works ("contains")', 'Not filterable (field marked filterable = false)', 'TAVI extra'],
 ['Sum of a formula in a report / query', 'Correct (report 24 Nov)', 'Correct (SUM = 52)', 'Same'],
 ['Comparison with an empty field (Num > 10)', 'false', 'blank', 'Different (empty handling)'],
 ['Blueprint transition, import, formula editor screen', 'Blueprint: NDC-3217 (23 Nov); import computes; builder lists fields and 19 functions', 'Not compared: Zoho screens do not load in automation; blueprints and import need the Zoho UI', 'Open — manual check'],
 ['Desk', 'Same engine as CRM', 'Not compared: the Zoho Desk test account is an agent (Insufficient Privileges for field settings)', 'Open — needs a Zoho Desk admin login'],
];
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const html = '<h3>Behaviour side by side (live Zoho checks)</h3><table><tr><th>Behaviour</th><th>TAVI</th><th>Zoho</th><th>Verdict</th></tr>' + rows.map(r => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td></tr>`).join('') + '</table>';
let z = fs.readFileSync(path.join(RUN, 'out/zoho-section.html'), 'utf8'); z = z.replace(/<h3>Behaviour side by side[\s\S]*?<\/table>/, ''); z = z.replace('<h3>Answer: the combinations do not match Zoho</h3>', html + '\n<h3>Answer: the combinations do not match Zoho</h3>');
fs.writeFileSync(path.join(RUN, 'out/zoho-section.html'), z); console.log('ok');

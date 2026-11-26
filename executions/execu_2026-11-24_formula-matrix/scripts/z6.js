// Zoho function discovery: create a throwaway formula per candidate, record accepted/refused, delete at once.
const made = JSON.parse(fs.readFileSync(RUN + '/zoho/made.json', 'utf8'));
for (const id of made.fields || []) log('del probe', (await zf('DELETE', `/crm/v8/settings/fields/${id}?module=Leads`)).s); made.fields = []; fs.writeFileSync(RUN + '/zoho/made.json', JSON.stringify(made, null, 1));
const C = [
 ['Abs', 'double', ['Abs(-1)']], ['Ceil', 'double', ['Ceil(1.5)']], ['Floor', 'double', ['Floor(1.5)']], ['Round', 'double', ['Round(1.55,1)', 'Round(1.5)']], ['Sqrt', 'double', ['Sqrt(4)']],
 ['Max', 'double', ['Max(1,2)']], ['Min', 'double', ['Min(1,2)']], ['Naturallog', 'double', ['Naturallog(2)']], ['Base10log', 'double', ['Base10log(10)']], ['Power', 'double', ['Power(2,3)']], ['Mod', 'double', ['Mod(5,2)']],
 ['Sum', 'double', ['Sum(1,2)']], ['Avg', 'double', ['Avg(1,2)']], ['Average', 'double', ['Average(1,2)']], ['Count', 'double', ['Count(1,2)']],
 ['Len', 'double', ["Len('ab')", 'Len("ab")']], ['Find', 'double', ["Find('ab','b',1)", "Find('ab','b')"]], ['Concat', 'text', ["Concat('a','b')"]], ['Contains', 'boolean', ["Contains('ab','b')"]],
 ['Startswith', 'boolean', ["Startswith('ab','a')"]], ['Endswith', 'boolean', ["Endswith('ab','b')"]], ['Lower', 'text', ["Lower('A')"]], ['Upper', 'text', ["Upper('a')"]], ['Trim', 'text', ["Trim(' a ')"]],
 ['Substring', 'text', ["Substring('abc',1,2)"]], ['Replace', 'text', ["Replace('ab','a','c')"]], ['Tostring', 'text', ['Tostring(1)']], ['Tonumber', 'double', ["Tonumber('1')"]], ['Text', 'text', ['Text(1)']], ['Value', 'double', ["Value('1')"]], ['Coalesce', 'text', ["Coalesce('a','b')"]],
 ['Now', 'datetime', ['Now()']], ['Today', 'date', ['Today()']], ['Newdate', 'datetime', ["Newdate(2026,1,1,10,30,'AM')", 'Newdate(2026,1,1)']], ['Datepart', 'date', ['Datepart(Now())']], ['Timepart', 'text', ['Timepart(Now())']],
 ['Adddate', 'datetime', ["Adddate(Now(),1,'DAY')"]], ['Subdate', 'datetime', ["Subdate(Now(),1,'DAY')"]], ['Datecomp', 'double', ['Datecomp(Now(),Now())']], ['Datebetween', 'double', ["Datebetween(Now(),Now(),'days')", 'Datebetween(Now(),Now())']],
 ['Daysbetween', 'double', ['Daysbetween(Now(),Now())']], ['Hoursbetween', 'double', ['Hoursbetween(Now(),Now())']], ['Weekday', 'double', ['Weekday(Now())']], ['Dayofmonth', 'double', ['Dayofmonth(Now())']], ['Hour', 'double', ['Hour(Now())']],
 ['Minute', 'double', ['Minute(Now())']], ['Month', 'double', ['Month(Now())']], ['Year', 'double', ['Year(Now())']], ['Fromtimestamp', 'datetime', ['Fromtimestamp(1700000000)']], ['Totimestamp', 'double', ['Totimestamp(Now())']],
 ['If', 'text', ["If(true,'a','b')", "If(1>0,'a','b')"]], ['And', 'boolean', ['And(true,false)']], ['Or', 'boolean', ['Or(true,false)']], ['Not', 'boolean', ['Not(true)']],
 ['IsEmpty', 'boolean', ["IsEmpty(${Last_Name})", "IsEmpty('')"]], ['Isempty', 'boolean', ['Isempty(${Last_Name})']], ['IsBlank', 'boolean', ['IsBlank(${Last_Name})']], ['IsNull', 'boolean', ['IsNull(${Last_Name})']],
 ['CaseInsensitiveEquals', 'boolean', ["CaseInsensitiveEquals('a','A')"]], ['Case', 'text', ["Case(1,1,'a','b')"]], ['Isnumeric', 'boolean', ["Isnumeric('1')"]],
];
const res = {};
for (const [name, rt, exprs] of C) { res[name] = { ok: false, tries: [] };
  for (const ex of exprs) { const r = await zf('POST', '/crm/v8/settings/fields?module=Leads', { fields: [{ field_label: 'QA FX fn ' + name, data_type: 'formula', formula: { return_type: rt, expression: ex } }] });
    const f0 = r.j?.fields?.[0]; res[name].tries.push(ex + ' -> ' + r.s + ' ' + (f0?.code || '') + ' ' + (f0?.message || r.t.slice(0, 80)));
    if (f0?.details?.id) { res[name].ok = true; res[name].expr = ex; const d = await zf('DELETE', `/crm/v8/settings/fields/${f0.details.id}?module=Leads`); if (d.s >= 300) { made.fields.push(f0.details.id); fs.writeFileSync(RUN + '/zoho/made.json', JSON.stringify(made, null, 1)); res[name].delErr = d.t.slice(0, 120); } break; }
    if (r.s === 429 || /LIMIT/i.test(r.t)) { log('limit', r.t.slice(0, 200)); break; } } }
fs.writeFileSync(RUN + '/zoho/functions.json', JSON.stringify(res, null, 1));
log('accepted', Object.entries(res).filter(([, v]) => v.ok).map(([k]) => k).join(', ')); log('refused', Object.entries(res).filter(([, v]) => !v.ok).map(([k, v]) => k + ' [' + v.tries[v.tries.length - 1].slice(-60) + ']').join(' | '));

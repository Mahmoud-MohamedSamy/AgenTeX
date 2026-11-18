const o = {}; const id = r => r.j && r.j.data && r.j.data.id;
const fl = await fieldsOf(L); const pl = fl.find(x => x.fieldName === 'qa_rt18sr_pl'); o.pl = pl && JSON.stringify(pl.datatypeOptions || pl.config).slice(0, 200);
let f = fl.find(x => x.fieldName === 'qa_rt20sc_date');
if (!f) { const m = await mkField('qa_rt20sc_date', 'date'); o.mkField = m.s + ' ' + m.err; }
f = (await fieldsOf(L)).find(x => x.fieldName === 'qa_rt20sc_date'); o.dateField = f && f.datatypeKey; I.dateField = f && f.id; SAVE();
return o;

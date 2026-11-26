const out = [];
let x = await askCard('On the lead named "QA-P3-X", set the field "Title" (API name: title, the job title) to QA-P3-Z.'); let c = x.acts[0] ? await confirmA(x.acts[0]) : null;
const g = await getRec(M.leads, P3I.leadB);
out.push(p3rec('A-01b', '?', `card=${x.card || 'none'}; lines=${JSON.stringify(x.lines || '').slice(0, 200)}; confirm=${JSON.stringify(c)}; title now (as CRM-M)=${val(g.rec, 'title')}; text=${x.text.slice(0, 250)}`, { conv: x.conv }));
x = await askCard('On the lead named "QA-P3-X", set the field "Single Line" (API name: single_line) to QA-P3-Y.'); c = x.acts[0] ? await confirmA(x.acts[0]) : null;
const r2 = await ask('What is the value of the field with API name single_line on the lead "QA-P3-X"?', { page: { app: 'crm' } });
out.push(p3rec('A-02b', '?', `card=${x.card || 'none'}; lines=${JSON.stringify(x.lines || '').slice(0, 200)}; confirm=${JSON.stringify(c)}; text=${x.text.slice(0, 200)}; read-ask=${tiaText(r2).slice(0, 250)}`, { conv: x.conv }));
return out.map(o => o.id + ' ' + o.note.slice(0, 400));

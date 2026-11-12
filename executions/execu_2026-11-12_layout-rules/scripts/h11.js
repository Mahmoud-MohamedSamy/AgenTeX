const g = (await api('GET', '/web-forms/' + I.hcform)).j.data; const def = JSON.parse(JSON.stringify(g.definition));
def.fields = def.fields.filter(f => f.key !== (process.env.UNDO ? '__none' : 'qa_lr_type'));
if (process.env.UNDO) def.fields.splice(6, 0, { ...def.fields.find(f => f.key === 'qa_lr_note'), key: 'qa_lr_type' });
const r = await api('PUT', '/web-forms/' + I.hcform, { ...g, definition: def }, { 'if-match': String(g.row_version) }); const a = (await api('GET', '/web-forms/' + I.hcform)).j.data;
return { put: SR(r).slice(0, 300), fields: a.definition.fields.map(f => f.key).filter(k => /qa_lr/.test(k)), definition_errors: JSON.stringify(a.definition_errors).slice(0, 400) };

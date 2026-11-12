// low user: save without the note field it cannot change / see
const OI = JSON.parse(fs.readFileSync(RUN + '/out/ids-crm.json', 'utf8')); const mid = OI.mod_leads; const L = OI.layout;
const eff = await api('GET', '/modules/' + mid + '/field-permissions/effective');
const effNote = JSON.stringify(eff.j && eff.j.data).match(/.{0,80}qa_vr_note.{0,80}/);
const rec = await api('POST', '/modules/' + mid + '/records', { data: [{ field: 'first_name', value: { kind: 'string', value: 'QA' } }, { field: 'last_name', value: { kind: 'string', value: P + ' H6 low ' + process.env.FPM } }, { field: 'qa_vr_text', value: { kind: 'string', value: 'fine' } }], layout_id: L });
if (rec.j && rec.j.data) fs.appendFileSync(RUN + '/out/low-recs.txt', rec.j.data.id + '\n');
return { eff: eff.s + ' ' + (effNote && effNote[0]), rec: SR(rec).slice(0, 300) };

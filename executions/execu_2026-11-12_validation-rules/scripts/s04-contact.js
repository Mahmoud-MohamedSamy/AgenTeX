const cm = await modId('desk_contacts'); const F = await fieldsOf(cm); log('req', F.filter(f => f.required).map(f => f.fieldName + ':' + f.datatypeKey).join(' '));
const r = await mkRec(cm, { first_name: 'QA', last_name: P + ' contact', email: 'qa.vr1112@example.com' });
log('contact', r.s, r.err); if (!r.id) return 'no contact';
I.contact = r.id; I.base.contact_id = r.id; SAVE(); LED('desk contact ' + r.id); return I.base;

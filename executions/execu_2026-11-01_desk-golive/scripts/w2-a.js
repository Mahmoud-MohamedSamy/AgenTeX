// A: contact + base ticket
const c = await mkRec(CM, { first_name: 'QA GL W2', last_name: 'Contact', email: 'mmohamed@anyware.software' }, 'contact');
const t = await mkRec(T, { subject: 'QA GL W2 base ticket', status: 'Open', priority: 'High', department: DQ, contact_id: c.id || null, description: 'Go-live wave 2 test ticket. Safe to delete.', channel: 'Phone' }, 'base');
const g = t.id ? await getRec(T, t.id) : null;
return fin({ c, t, g });

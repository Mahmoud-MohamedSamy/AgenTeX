const R = 'f68207e6-1bf9-4134-a3ae-7e29db2c45e9';
const sendAt = new Date(Date.now() + 3 * 86400000).toISOString().replace(/\.\d+Z$/, 'Z');
const sc = await call('POST', '/mail/drafts', { to: ['mahmoud.mmohamedsamy@gmail.com'], subject: 'QA W4 scheduled 1026', body: 'QA W4 scheduled', body_html: '<p>QA W4 scheduled</p>', record_type: 'leads', record_id: R, attachments: [], send_at: sendAt });
const upd = await call('PUT', '/mail/drafts/f07b7435-ac61-4453-94ee-ca0b8cec9879', { to: ['mahmoud.mmohamedsamy@gmail.com'], subject: 'QA W4 draft 1026 edited', body: 'edited', body_html: '<p>edited</p>', record_type: 'leads', record_id: R, attachments: [] });
const g = await call('GET', '/mail/drafts/f07b7435-ac61-4453-94ee-ca0b8cec9879');
return { scheduled: sc.s + ' ' + sc.t.slice(0, 300), update: upd.s, draftNow: g.j && g.j.data && g.j.data.subject, scheduledId: sc.j && sc.j.data && sc.j.data.id };

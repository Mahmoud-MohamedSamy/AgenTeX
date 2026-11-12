await sleep(5000);
const t = await findT('QA GL W4');
for (const d of t) if (!/^(Re: )?QA GL W4 (mail|بريد)/.test(d.subject || '')) CREATED.push({ kind: 'ticket', id: d.id, name: d.ticket_number + ' ' + String(d.subject).slice(0, 40) });
return fin({ rows: t.map(d => [d.id, d.ticket_number, String(d.subject).length + ':' + String(d.subject).slice(0, 80), d.status, d.channel, d.department_id && d.department_id.slice(0, 8), d.email, d.contact_id && d.contact_id.slice(0, 8), d.owner, d.created_at].join(' | ')) });

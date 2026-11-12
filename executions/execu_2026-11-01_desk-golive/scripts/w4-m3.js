const t = await findT('QA GL W4');
return fin({ rows: t.filter(d => d.channel === 'email' || /mail|بريد/.test(d.subject)).map(d => [d.id, d.ticket_number, d.subject, d.channel, d.department, d.email, d.created_at].join(' | ')), n: t.length });

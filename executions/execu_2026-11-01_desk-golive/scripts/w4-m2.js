const a = arr(D((await api('GET', '/modules/' + TM + '/records?limit=8&sort=-created_at')).j)).map(flat);
return fin({ rows: a.map(d => [d.ticket_number, String(d.subject).slice(0, 50), d.channel, d.department_id && d.department_id.slice(0, 8), d.email, d.created_at].join(' | ')) });

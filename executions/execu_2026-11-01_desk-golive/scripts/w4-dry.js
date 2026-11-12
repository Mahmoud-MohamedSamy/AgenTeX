const s = await api('GET', '/modules/' + TM + '/records?limit=100&q=' + encodeURIComponent('QA GL W4'));
out.list = arr(D(s.j)).map(flat).filter(t => /^QA GL W4/.test(t.subject || '')).map(t => [t.ticket_number, t.subject.slice(0, 50), t.email, t.created_at.slice(0, 16)]);
return fin({ out });

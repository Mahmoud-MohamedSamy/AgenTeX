const r = await api('GET', '/modules/' + TM + '/records?limit=40&sort=-created_at');
out.recent = arr(D(r.j)).map(flat).filter(t => /QA GL W4|بريد/.test(t.subject || '') && t.created_at > '2026-11-12T20:00').map(t => ({ id: t.id, n: t.ticket_number, s: t.subject, ch: t.channel, dep: t.department === '2a73bbc0-efb3-4250-bf9b-2fdc98236794' ? 'Marketing' : (String(t.department).startsWith('7e1ac409') ? 'Customer Support' : t.department), e: t.email, at: t.created_at }));
const tp = await api('GET', '/desk/community/topics?limit=20&q=' + encodeURIComponent('QA GL W4'));
out.topics = arr(D(tp.j)).map(x => ({ id: x.id, t: x.title, ex: x.excerpt, state: x.state, at: x.created_at, link: x.permalink }));
return fin({ out });

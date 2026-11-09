const A4 = '44681cc8-30c5-49b5-a50d-718fee90c862'; const FWD = 'mahmoud.mmohamedsamy@gmail.com';
const f = await api('POST', `/desk/tickets/${A4}/replies`, { mode: 'forward', to: [FWD], subject: 'Fwd: QA WF A4 ticket', body_html: '<p>QA WF A4 forward — please reply to this email (round 7 test of incoming private threads).</p>' });
await sleep(20000);
const fired = arr((await api('GET', `/desk/tickets/${A4}/comments`)).j?.data).filter(c => /fired/.test(c.body_html)).map(c => c.body_html.replace(/<[^>]+>/g, '') + ' @' + c.created_at.slice(11, 19));
const t = await getTicket(A4);
return fin({ forward: f.s + (f.s >= 300 ? ' ' + f.t.slice(0, 200) : ''), fired, number: t.ticket_number, execs: await execs(A4) });

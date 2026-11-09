// As the Desk Agent (Customer Support, has the department mailbox): new A1 ticket + reply to the QA mailbox.
const T = '88e8ea44-1658-4df3-9930-d0902b91073d', CS = '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158';
const enc = v => ({ kind: 'string', value: String(v) });
const r = await api('POST', `/modules/${T}/records`, { data: Object.entries({ subject: 'QA WF A1 gmail ticket', status: 'Open', department: CS, email: 'mahmoud.mmohamedsamy@gmail.com', channel: 'email' }).map(([k, v]) => ({ field: k, value: enc(v) })) });
const id = r.j?.data?.id; if (!id) return { create: r.s, err: r.t.slice(0, 300) };
await sleep(3000);
const rp = await api('POST', `/desk/tickets/${id}/replies`, { mode: 'reply', to: ['mahmoud.mmohamedsamy@gmail.com'], subject: 'QA WF A1 (3, Gmail) — please reply to this email', body_html: '<p>QA WF A1: please reply to this email with any text. Your reply should land on this ticket and fire the Customer Reply rule.</p>' });
const reply = rp.j?.data?.reply || rp.j?.data;
const g = await api('GET', `/modules/${T}/records/${id}`); const num = (g.j?.data?.data || []).find(x => x.field === 'ticket_number')?.value?.value;
return { ticket: id, number: num, reply: rp.s + ' ' + (reply?.status || rp.t.slice(0, 200)), from: reply?.from_address };

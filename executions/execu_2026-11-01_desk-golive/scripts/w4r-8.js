const MK = '2a73bbc0-efb3-4250-bf9b-2fdc98236794', CON = 'de7195a2-369e-48c5-b03f-b8e37d6c5fb2', EM = 'mmohamed@anyware.software'; const sv = v => ({ kind: 'string', value: v });
out.t = {};
for (const subj of ['QA GL W4R rating 2 Arabic', 'QA GL W4R rating 3 switched off']) {
  const c = await api('POST', '/modules/' + TM + '/records', { data: [{ field: 'subject', value: sv(subj) }, { field: 'description', value: sv(subj) }, { field: 'department', value: sv(MK) }, { field: 'contact_id', value: sv(CON) }, { field: 'email', value: sv(EM) }, { field: 'status', value: sv('Open') }] });
  const id = D(c.j) && D(c.j).id; const o = out.t[subj] = { c: c.s, id }; if (!id) continue; CREATED.push({ kind: 'ticket', id, label: subj });
  o.reply = (await api('POST', '/desk/tickets/' + id + '/replies', { mode: 'reply', to: [EM], cc: [], bcc: [], subject: 'Re: ' + subj, body_html: '<p>' + subj + ': reply before closing.</p>' })).s; await sleep(3000);
  o.close = (await api('POST', '/desk/tickets/' + id + '/close', {})).s;
  o.n = flat(D((await api('GET', '/modules/' + TM + '/records/' + id)).j) || {}).ticket_number;
}
return fin({ out });

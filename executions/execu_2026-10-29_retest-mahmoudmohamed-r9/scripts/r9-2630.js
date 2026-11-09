// NDC-2630: send an email from a QA lead as the owner (sender domain without a working connection); recipient on example.com (no inbox).
// Pass bar: the send is reported as failed (not "Sent"), the record shows it failed (or nothing), the timeline has no EmailSent.
const out = {}; const TO = 'qa.rt.2630@example.com';
const l = (await X.lead('o', 'QA RT 2630 mail lead', { email: TO })).j?.data?.id; out.lead = l;
const d = await api('o', 'POST', '/mail/drafts', { to: [TO], subject: 'QA RT 2630 send result', body: 'QA NDC-2630 send result check', body_html: '<p>QA NDC-2630 send result check</p>', record_type: 'leads', record_id: l, attachments: [] });
out.draft = d.s + ' ' + (d.j?.data?.id || d.t.slice(0, 200)); const id = d.j?.data?.id; if (!id) return out; ledger(`mail draft ${id} on lead ${l}`);
const s = await api('o', 'POST', `/mail/drafts/${id}/send`, {}); out.send = s.s + ' ' + s.t.replace(/[\w.+-]+@[\w.-]+/g, '<email>').slice(0, 400);
let mails = '', sent = '', tl = [];
for (let i = 0; i < 10; i++) {
  await sleep(5000);
  mails = (await api('o', 'GET', `/mail/records/leads/${l}/emails?box=mails&limit=10`)).t; sent = (await api('o', 'GET', `/mail/records/leads/${l}/emails?box=sent&limit=10`)).t;
  tl = arr((await api('o', 'GET', `/timeline/records/leads/${l}/feed`)).j?.data).map(e => e.entry_type);
  if (/"status"/.test(mails + sent)) break;
}
const red = x => x.replace(/[\w.+-]+@[\w.-]+/g, '<email>');
out.mails = red(mails).slice(0, 500); out.sentBox = red(sent).slice(0, 300); out.timeline = tl;
out.draftAfter = (await api('o', 'GET', `/mail/drafts/${id}`)).s;
return out;

// Agent address as Cc: mode reply vs reply_all vs forward (API, on QA RPL ticket 2)
const L = await api('GET', `/modules/${M.tickets}/records?page=1&per_page=40&sort_by=created_at&sort_dir=desc`); const tk = ((L.j.data.records || L.j.data.items || L.j.data) || []).map(fl).find(x => x.subject === 'QA RPL ticket 2').id;
const out = {};
for (const mode of ['reply', 'reply_all']) { const r = await api('POST', `/desk/tickets/${tk}/replies`, { mode, to: [QA_EMAIL], cc: [QA_CC], subject: 'Re: QA RPL ticket 2', body_html: '<p>QA RPL agent-cc ' + mode + '</p>' }); out[mode] = r.s + ' ' + (r.j && r.j.error ? r.j.error.message : 'sent cc=' + JSON.stringify(r.j.data.reply.cc)); }
return JSON.stringify(out);

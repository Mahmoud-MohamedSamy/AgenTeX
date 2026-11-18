const pr = async (m, p, b) => { const r = await api(m, p, b); return r.s + (r.s >= 300 ? ' ' + ((r.j && r.j.error && (r.j.error.message || r.j.error.code)) || r.t.slice(0, 60)).slice(0, 100) : ''); };
const perms = (await api('GET', '/iam/me/permissions?app_key=desk')).t; out.perm = (perms.match(/desk:ticket:[a-z_]+/g) || []).map(x => x.slice(12)).join(' ');
out.list = (await listQA()).ids.filter(x => /^[A-Z]/.test(x)).join(',');
const id = TK.CSD;  // now in HR? use SH2 (CS, owned by E) and MK2 (shared restricted to CS)
for (const k of ['SH2', 'MK2', 'CST']) { const P = '/desk/tickets/' + TK[k]; out[k] = { view: (await api('GET', '/modules/' + TM + '/records/' + TK[k])).s, edit: await pr('PATCH', '/modules/' + TM + '/records/' + TK[k], { data: [{ field: 'priority', value: sv('medium') }] }), comment: await pr('POST', P + '/comments', { body_html: '<p>QA AC light agent comment ' + k + '</p>', is_private: true }), reply: await pr('POST', P + '/replies', { mode: 'reply', to: ['mmohamed@anyware.software'], cc: [], bcc: [], subject: 'Re: QA AC', body_html: '<p>QA AC light reply test (ignore)</p>' }), pick: await pr('POST', P + '/pick-up', {}), move: await pr('POST', P + '/move', { department_id: DEP.HR }) }; }
await go('/views/all/tickets/' + TK.MK2, 9000); out.ui = (await head()).slice(0, 300); await shot('access/d-light-mk2');
return fin({ out });

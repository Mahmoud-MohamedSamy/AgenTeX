await page.goto(H + '/hq', { waitUntil: 'commit' }).catch(() => {}); hdr = null; await sleep(5000);
const pr = async (m, p, b) => { const r = await api(m, p, b); return r.s + (r.s >= 300 ? ' ' + ((r.j && r.j.error && (r.j.error.message || r.j.error.code)) || r.t.slice(0, 60)).slice(0, 110) : ''); };
out.myShare = (await api('GET', '/iam/me/permissions?app_key=desk')).t.includes('desk:ticket:share');
for (const k of ['SH1', 'SH2']) { const P = '/desk/tickets/' + TK[k]; out[k] = { reshare: await pr('PUT', P + '/shares', { shares: [{ department_id: DEP.CS, access: 'full' }, { department_id: DEP.HR, access: 'read_only' }] }), unshare: await pr('PUT', P + '/shares', { shares: [] }), change: await pr('PUT', P + '/shares', { shares: [{ department_id: DEP.CS, access: 'full' }] }), after: (await api('GET', P + '/shares')).t.match(/"(department_name|access)":"[^"]+"/g)?.join(',') }; }
out.fwdRestricted = await pr('POST', '/desk/tickets/' + TK.MK2 + '/replies', { mode: 'forward', to: ['mmohamed@anyware.software'], cc: [], bcc: [], subject: 'Fwd: QA AC MK2', body_html: '<p>QA AC restricted internal forward test (please ignore)</p>' });
// own ticket share (C's own CS ticket) to prove the grant works
out.ownShare = await pr('PUT', '/desk/tickets/' + TK.CSC + '/shares', { shares: [{ department_id: DEP.HR, access: 'read_only' }] }); out.ownUnshare = await pr('PUT', '/desk/tickets/' + TK.CSC + '/shares', { shares: [] });
return fin({ out });

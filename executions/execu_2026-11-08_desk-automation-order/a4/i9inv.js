const old = JSON.parse(fs.readFileSync('../a4/agent.json'));
const c = await api('POST', `/iam/users/invitations/${old.inv}/cancel`, {}); 
await sleep(3000);
const r = await api('POST', '/iam/users/invite', { email: 'mahmoud.mmohamedsamy+wf@gmail.com', profile_id: '44444444-4444-4444-4444-444444444402', display_name: 'QA AO WF Agent' });
const d = r.j?.data || {}; const inv = d.invitationId || d.invitation_id || d.id; const uid = d.userId || d.user_id;
if (r.s < 300) fs.writeFileSync('../a4/agent.json', JSON.stringify({ uid, inv, prev: old }, null, 1));
await sleep(3000); const u = arr((await api('GET', '/iam/users?search=WF%20Agent')).j?.data).map(x => x.status);
log({ cancel: c.s, invite: r.s, err: r.s >= 300 ? r.t.slice(0, 200).replace(/[\w.+-]+@[\w.-]+/g, '<email>') : undefined, keys: Object.keys(d), hasInv: !!inv, rows: u });

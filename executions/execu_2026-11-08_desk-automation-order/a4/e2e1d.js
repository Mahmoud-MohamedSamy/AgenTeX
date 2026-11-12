const S = JSON.parse(fs.readFileSync('../a4/e2e134.json')); const rid = S.e1.rule;
const cur = (await api('GET', '/workflow/rules/' + rid)).j?.data; const a0 = cur.actions[0];
S.e1d = { flags: Object.fromEntries(Object.entries(a0).filter(([k]) => /owner/i.test(k))) };
const acts = cur.actions.map((a, i) => i === 0 ? { ...a, ownerOnlyOnlineUsers: false, ownerOnlyOnlineUser: false } : a);
S.e1d.patch = (await api('PATCH', '/workflow/rules/' + rid, { actions: acts })).s;
S.e1d.flagsAfter = Object.fromEntries(Object.entries((await api('GET', '/workflow/rules/' + rid)).j?.data.actions[0]).filter(([k]) => /owner/i.test(k)));
const ids = []; for (const s of ['urgent E', 'urgent F']) { const t = await mkTicket('E2E1', { priority: 'urgent', owner: null }, s); ids.push(t.id); await sleep(5000); }
await sleep(15000);
const NM = { '876ce871-2b02-4854-89a7-68050391c62b': 'Test User 1', '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4': 'Dev Team 2', [OWNER]: 'owner' };
S.e1d.owners = []; for (const id of ids) { const g = await getTicket(id); S.e1d.owners.push(NM[g.owner] || g.owner || 'none'); }
S.e1d.ids = ids; fs.writeFileSync('../a4/e2e134.json', JSON.stringify(S, null, 1)); log(JSON.stringify(S.e1d, null, 1));

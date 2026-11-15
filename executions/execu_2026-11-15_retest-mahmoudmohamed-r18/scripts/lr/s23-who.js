const csv = fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/docs/Credentials/TAVI Desk Credentials.csv', 'utf8').split(/\r?\n/).filter(Boolean).map(l => l.split(','));
const head = csv[0].map(s => s.trim()); const ei = head.findIndex(h => /mail|user/i.test(h));
const us = arr((await api('GET', '/iam/users?limit=200&pageSize=200')).j.data); const out = { header: head.length };
for (const lab of ['Test User 1', 'Mahmoud Samy']) { const row = csv.find(r => r[0].trim() === lab); const e = row ? row.find(c => /@/.test(c)) : null; const u = e ? us.find(x => (x.email || '').toLowerCase() === e.trim().toLowerCase()) : null; out[lab] = u ? { displayName: u.displayName, profiles: u.profileNames, id: u.userId } : 'no match in NDC-Staging users'; }
return out;

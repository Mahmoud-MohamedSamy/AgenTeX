// NDC-613: export scope (view_self + export grant → only U1's own rows), then remove every override set in this ticket.
const K = ['iam.security.loginhistory.view_self', 'iam.security.loginhistory.view_team', 'iam.security.loginhistory.view_all'];
const out = {};
for (const k of K) out['clear ' + k.split('.').pop()] = (await api('o', 'DELETE', `/iam/users/${T.U1}/overrides/${k}?reason=QA%20RT%20613`)).s;
await sleep(3000);
const ex = await api('u1', 'GET', '/audit/login-history/export'); const lines = ex.t.split(/\r?\n/).filter(Boolean);
out.exportStatus = ex.s; out.header = lines[0]; out.rows = lines.length - 1;
const ci = lines[0].split(',').findIndex(h => /user|email/i.test(h));
const users = [...new Set(lines.slice(1).map(l => l.split(',')[ci]))];
out.distinctUsers = users.map(u => u.replace(/[\w.+-]+@/, '<user>@')); out.onlyOwn = users.every(u => /cetow80696/.test(u));
const list = arr((await api('u1', 'GET', '/audit/login-history?limit=50')).j?.data); out.listOwnOnly = list.every(x => JSON.stringify(x).includes(T.U1) || JSON.stringify(x).includes('cetow80696'));
out.clearGrant = (await api('o', 'DELETE', `/iam/users/${T.U1}/overrides/iam.security.loginhistory.export?reason=QA%20RT%20613`)).s;
out.overridesLeft = (await api('o', 'GET', `/iam/users/${T.U1}/overrides`)).t.slice(0, 200);
ledger(`U1 login-history overrides removed: ${out.overridesLeft.includes('[]') ? 'none left' : out.overridesLeft}`);
return out;

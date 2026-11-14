const { call, ID } = require('./bp/ndc'); const fs = require('fs');
const made = require('./made.json'); const tks = made.tickets;
(async () => {
  const out = {};
  for (const w of ['A', 'B', 'C']) { const r = await call(w, 'GET', '/iam/me/permissions'); const s = JSON.stringify(r.json?.data || ''); out[w] = { manage: /desk:blueprints:manage|metadata\.blueprint\.manage/.test(s), revoke: /desk:ticket:blueprint_revoke/.test(s) }; }
  console.log('perms', JSON.stringify(out));
  // ticket j10 b (Open, owner = owner) - try revoke by each agent without manage; owner last
  const t = tks[tks.length - 2];
  for (const w of ['A', 'B', 'C']) { const r = await call(w, 'POST', `/desk/tickets/${t}/blueprint/revoke`, {}); console.log('revoke by', w, r.status, r.code || '', String(r.msg || '').slice(0, 120)); if (r.status < 300) break; }
})();

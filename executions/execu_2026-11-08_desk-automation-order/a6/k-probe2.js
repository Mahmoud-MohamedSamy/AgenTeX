const n = require('./bp/ndc'); const { call } = n; const HC = 'e74f2abb-e28d-400e-908c-f2c54862e389'; const C = '43004ce2-577f-4eda-b00a-0750fe40c3d4';
(async () => {
  for (const p of [`/help-centers/${HC}/users`, `/help-centers/${HC}/portal-users`, `/help-centers/${HC}/invitations`, `/help-centers/${HC}/contacts`, `/help-centers/${HC}/invitations/contacts`]) { const r = await call('owner', 'GET', p); const s = JSON.stringify(r.json?.data ?? r.json ?? '').replace(/[\w.+-]+@[\w.-]+/g, m => /\+(qaao|wfp|wf)@/.test(m) ? m.replace(/^.*\+/, '+') : '<mail>'); console.log(p, r.status, s.slice(0, 500)); }
  const q = await call('owner', 'POST', `/modules/${C}/records/search`, { criteria: { op: 'contains', field: 'email', value: 'mmohamedsamy+' } }); console.log('contact search', q.status, JSON.stringify(q.json?.data ?? q.json).replace(/mahmoud\.mmohamedsamy/g, 'G').slice(0, 600));
})();

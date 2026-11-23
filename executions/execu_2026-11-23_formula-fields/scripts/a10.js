const me = await api('GET', '/iam/me'); log('me', E(me), JSON.stringify({ role: me.j?.data?.role || me.j?.data?.roles, profile: me.j?.data?.profile || me.j?.data?.profileName }).slice(0, 300));
const f = await api('POST', `/modules/7267b791-47cc-479c-aa79-c35acbdeff4c/fields`, { fields: [fdef('fx_a10', 'QA FX A10', 'formula', { expression: '1 + 1', return_kind: 'number' })] }); log('A10 create formula as CRM user', E(f));
const r = await api('GET', `/modules/7267b791-47cc-479c-aa79-c35acbdeff4c/records?limit=3`); log('read QA FX records as user', E(r));

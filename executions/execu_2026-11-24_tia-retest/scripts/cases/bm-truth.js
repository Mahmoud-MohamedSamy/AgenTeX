const t = async (mod, f) => { const r = await api('GET', `/modules/${mod}/records?page=1&per_page=1${f ? '&filters=' + encodeURIComponent(JSON.stringify(f)) : ''}`); return r.s + ':' + r.j?.meta?.total_count; };
const me = (await api('GET', '/iam/users/me')).j?.data?.user_id; const T = 'a9d87b62-b704-4c2e-b2d5-1b745d7c2065';
const o = { tickets: await t('88e8ea44-1658-4df3-9930-d0902b91073d'), deskContacts: await t('43004ce2' === '' ? '' : (arr((await api('GET', '/modules?app_key=desk&limit=200')).j?.data).find(m => /contacts/i.test(m.apiName || m.moduleKey || ''))?.id)) };
for (const op of ['equals', 'eq', 'is', 'Equal', 'in']) o['myTasks_' + op] = await t(T, [{ field: 'owner', operator: op, value: op === 'in' ? [me] : me }]);
o.nameStarts = await t(M.leads, [{ field: 'first_name', operator: 'starts_with', value: 'Name' }]); o.nameContains = await t(M.leads, [{ field: 'first_name', operator: 'contains', value: 'Name' }]);
return o;

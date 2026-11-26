const t = async (mod, f) => { const r = await api('GET', `/modules/${mod}/records?page=1&per_page=1&filters=${encodeURIComponent(JSON.stringify(f))}`); return r.s + ':' + r.j?.meta?.total_count + (r.s >= 300 ? ' ' + (r.t || '').slice(0, 90) : ''); };
const me = (await api('GET', '/iam/users/me')).j?.data?.user_id; const T = 'a9d87b62-b704-4c2e-b2d5-1b745d7c2065'; const o = {};
for (const op of ['today', 'this_week', 'last_week', 'this_month', 'last_month']) o['leads_created_' + op] = await t(M.leads, [{ field: 'created_at', operator: op }]);
for (const [op, v] of [['contains_any_of', [me]], ['is', me], ['equal', me], ['in', [me]], ['eq', me]]) o['tasks_owner_' + op] = await t(T, [{ field: 'owner', operator: op, value: v }]);
o.dealsAll = await t('f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', []); return o;

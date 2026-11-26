const o = {};
o.settings = (await api.O('GET', '/desk/settings/approvals')).j?.data;
o.techPending = arr((await api.O('GET', `/web-forms/${TECH_FORM}/pending?status=pending`)).j?.data?.items || (await api.O('GET', `/web-forms/${TECH_FORM}/pending?status=pending`)).j?.data).map(x => x.id);
for (const k of ['O', 'A', 'B', 'D', 'S']) { const i = await inbox(k); o['inbox_' + k] = i.s + ' ' + JSON.stringify(i.d?.counts) + ' perms ' + JSON.stringify(i.d?.permissions); }
o.depts = (await api.O('POST', '/desk/agents/departments/query', { user_ids: Object.values(U), agent_user_ids: Object.values(U) })).j?.data;
fs.writeFileSync(RUN + '/baseline.json', JSON.stringify(o, null, 1)); return { ...o, depts: undefined };

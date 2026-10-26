const A = '784400e1-4a2a-42c2-b4f3-7ca56e79828a';
const r = await api('GET', `/modules/${A}/records/e94d9d81-97d6-4b0a-9c88-00b97f885f83`);
const d = Object.fromEntries(((r.j?.data?.data) || []).map(e => [e.field, e.value?.value]));
const f = arr((await api('GET', '/desk/integrations/crm/failures?limit=50')).j?.data).filter(x => /B2215/.test(x.last_error || '')).map(x => ({ created: x.created_at, updated: x.updated_at, attempts: x.attempts }));
return done({ s: r.s, name: d.account_name || d.name, keys: Object.keys(d).slice(0, 10), deleted: r.j?.data?.is_deleted, f });

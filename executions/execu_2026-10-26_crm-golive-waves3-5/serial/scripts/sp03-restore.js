const K = 'iam.security.session.max_concurrent', get = async () => (await call('GET', `/settings/resolved?app_key=iam&key=${K}&scope_type=Org`)).j.data;
const v = await get(); const p = await call('PUT', '/settings/values', { app_key: 'iam', key: K, scope_type: 'Org', scope_id: null, value_json: '20', expected_version: v.version });
return { put: p.s, now: (await get()).value_json };

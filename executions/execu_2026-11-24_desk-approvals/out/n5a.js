const get = async k => (await api.B('POST', '/settings/resolved-batch', { items: [{ app_key: 'general', key: k, scope_type: 'User' }] })).j?.data?.resolved?.[0];
const cur = await get('general.user.locale.timezone');
const r = await api.B('PUT', '/settings/value', { app_key: 'general', key: 'general.user.locale.timezone', scope_type: 'User', scope_id: null, value_json: JSON.stringify('Asia/Dubai'), expected_version: cur.version });
ledger('B timezone -> Asia/Dubai ' + r.s);
return { before: cur, set: E(r), now: await get('general.user.locale.timezone') };

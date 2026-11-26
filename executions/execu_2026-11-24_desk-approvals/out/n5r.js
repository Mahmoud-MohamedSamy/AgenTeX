const keys = { timezone: null, language: 'en', date_format: 'DD/MM/YYYY', time_format: '24h' }; const o = {};
for (const [k, v] of Object.entries(keys)) { const key = 'general.user.locale.' + k;
  const cur = (await api.B('POST', '/settings/resolved-batch', { items: [{ app_key: 'general', key, scope_type: 'User' }] })).j?.data?.resolved?.[0];
  const r = await api.B('PUT', '/settings/value', { app_key: 'general', key, scope_type: 'User', scope_id: null, value_json: JSON.stringify(v), expected_version: cur.version });
  const now = (await api.B('POST', '/settings/resolved-batch', { items: [{ app_key: 'general', key, scope_type: 'User' }] })).j?.data?.resolved?.[0];
  o[k] = `${cur.value_json} -> ${now.value_json} (${r.s})`; ledger(`B locale ${k} restored ${o[k]}`); }
return o;

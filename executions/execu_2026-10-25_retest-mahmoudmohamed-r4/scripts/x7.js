const f = await api('GET', '/desk/integrations/crm/failures?limit=200');
return arr(f.j?.data).map(x => [x.module_key, x.record_name, x.status, x.error_code, (x.last_error || '').slice(0, 60), (x.occurred_at || '').slice(0, 16), (x.parked_at || '').slice(0, 16)].join(' | '));

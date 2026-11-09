const U = '3445ec4a-020e-4f12-b156-dd2de7610164', out = {};
for (const app of ['crm', 'desk', '']) { const r = await call('GET', `/iam/users?${app ? 'app_key=' + app + '&' : ''}limit=200`); const l = Array.isArray(r.j.data) ? r.j.data : r.j.data.items; out[app || 'all'] = JSON.stringify(l.find(u => (u.userId || u.id) === U)); }
return out;

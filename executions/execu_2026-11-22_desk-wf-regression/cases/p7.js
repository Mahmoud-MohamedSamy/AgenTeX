const r = await api('GET', `/modules/${T}/records/a807e317-fbe5-45d1-9430-458bac494ed7`);
const u = await api('GET', '/iam/users/876ce871-2b02-4854-89a7-68050391c62b');
const d = r.j && r.j.data && r.j.data.data || [];
return { s: r.s, fields: d.filter(x => ['contact_id','account_id','owner','created_by','tags','skills','team','layout_id','ticket_number'].includes(x.field)).map(x => x.field + '=' + JSON.stringify(x.value).slice(0, 120)), user: u.s + ' ' + u.t.slice(0, 300) };

const cp = await api('GET', '/iam/tenant/company-profile'); const b = { ...cp.j.data }; for (const k of ['id', 'exists', 'created_at', 'updated_at', 'updated_by']) delete b[k];
const r = await api('PUT', '/iam/tenant/company-profile', { ...b, access_url: 'https://www.google.com' });
const g = await api('GET', '/iam/tenant/company-profile');
return done({ put: r.s, err: r.j && r.j.error, access_url: g.j.data.access_url, website: g.j.data.website, name: g.j.data.name, tz: g.j.data.time_zone });

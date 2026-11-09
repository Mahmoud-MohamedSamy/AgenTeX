const C = []; const S = (x) => x && (x.j ? { s: x.s, e: x.j.error, d: JSON.stringify(x.j.data).slice(0, 300) } : { s: x.s, t: x.t.slice(0, 200) });
const o = {};
// company
const cp = await api('GET', '/iam/tenant/company-profile'); const cpd = cp.j.data; o.W1_02 = { s: cp.s, name: cpd.name, tz: cpd.time_zone, keys: Object.keys(cpd).join(',') };
const body = { ...cpd }; for (const k of ['id', 'exists', 'created_at', 'updated_at', 'access_url']) delete body[k];
const p1 = await api('PUT', '/iam/tenant/company-profile', { ...body, website: 'https://qa-gl.example' }); const g1 = await api('GET', '/iam/tenant/company-profile');
const p2 = await api('PUT', '/iam/tenant/company-profile', { ...body, website: cpd.website }); const g2 = await api('GET', '/iam/tenant/company-profile');
o.W1_03 = { put: S(p1), after: g1.j.data.website, restore: p2.s, back: g2.j.data.website, nameKept: g2.j.data.name === cpd.name, tzKept: g2.j.data.time_zone === cpd.time_zone };
const n1 = await api('PUT', '/iam/tenant/company-profile', { ...body, website: 'not a url' }); const n2 = await api('PUT', '/iam/tenant/company-profile', { ...body, phone: '1'.repeat(300) });
const g3 = await api('GET', '/iam/tenant/company-profile'); o.W1_04 = { badUrl: S(n1), longPhone: S(n2), websiteNow: g3.j.data.website, phoneNowLen: (g3.j.data.phone || '').length };
if (g3.j.data.website !== cpd.website || g3.j.data.phone !== cpd.phone) { await api('PUT', '/iam/tenant/company-profile', body); o.W1_04.restored = true; }
// branding
const b0 = await api('GET', '/iam/tenant/company-profile/branding'); const bb = b0.j.data;
const b1 = await api('PUT', '/iam/tenant/company-profile/branding', { ...bb, logo_linkback_url: 'https://qa-gl.example' }); const b2 = await api('GET', '/iam/tenant/company-profile/branding');
const b3 = await api('PUT', '/iam/tenant/company-profile/branding', bb); const b4 = await api('GET', '/iam/tenant/company-profile/branding');
o.W1_07 = { put: S(b1), after: b2.j.data.logo_linkback_url, restore: b3.s, back: b4.j.data.logo_linkback_url };
return done({ o, C });

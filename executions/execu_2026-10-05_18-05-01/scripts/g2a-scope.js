// Read-only: find profile scopes for the test user and for a comparable admin user.
const U = '3445ec4a-020e-4f12-b156-dd2de7610164', ME = '18ba78c4-20c2-49e3-b159-55e1af2043ae';
const out = {};
for (const p of [`/iam/users/${U}`, `/iam/users/${U}/profiles`, `/iam/users/${ME}`, `/iam/users/${ME}/profiles`, '/iam/org-units', '/iam/org-units/tree', '/iam/tenant/org-units']) { const r = await api('GET', p); out[p] = r.s + ' ' + r.t.slice(0, 500); }
page.off('request', onReq);
return JSON.stringify(out);

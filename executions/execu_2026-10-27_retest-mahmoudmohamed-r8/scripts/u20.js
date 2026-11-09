const id = 'f7082675-ea1b-4220-bfd2-47925ef97570';
await shot('1678-05-add-modules-keys');
await page.getByText('qa_rt_partners', { exact: true }).last().click({ force: true }); await sleep(600);
await page.getByRole('button', { name: 'Add', exact: true }).last().click({ force: true }); await sleep(1500);
const resp = []; page.on('response', r => { const q = r.request(); if (q.method() !== 'GET' && /teamspaces/.test(q.url())) resp.push(q.method() + ' ' + q.url().replace(/^.*\/api\/v1/, '') + ' → ' + r.status()); });
await page.getByRole('button', { name: 'Save', exact: true }).last().click({ force: true }); await sleep(6000); await shot('1678-06-saved');
const toasts = (await txt()).split('\n').filter(l => /updated|saved|error|success|least one/i.test(l)).slice(0, 4);
const t = (await api('GET', `/teamspaces/${id}`)).j?.data; const acl = (await api('GET', `/teamspaces/${id}/acl`)).j?.data?.rows;
return done({ resp, toasts, icon: t?.icon, iconColor: t?.iconColor, admins: (acl || []).filter(r => r.access_level === 'admin').map(r => r.principal_id.slice(0, 8)), desc: t?.description });

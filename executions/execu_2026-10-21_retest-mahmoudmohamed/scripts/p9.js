await page.getByRole('button', { name: 'Cancel', exact: true }).last().click().catch(() => {}); await sleep(1500);
const r = await api('GET', '/iam/users?limit=100');
const u = arr(r.j.data).filter(x => /nameb56175|valafo4080|ndc-staging-owner|mahmoud.mahamed1515/.test(x.email || '')).map(x => (x.email) + ' ' + (x.user_id || x.id));
return done({ u, url: page.url() });

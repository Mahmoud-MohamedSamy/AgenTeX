const id = 'f7082675-ea1b-4220-bfd2-47925ef97570'; const out = {};
await page.getByText('mahmoud.mahamed1515', { exact: true }).first().click({ force: true }); await sleep(1500); const d = page.locator('[role=dialog]').last(); await page.getByText('nameb56175@airhemp.com', { exact: true }).last().click({ force: true }); await sleep(600); await page.getByRole('button', { name: 'Save', exact: true }).last().click({ force: true }); await sleep(2500);
await page.getByText('QR', { exact: true }).first().click({ force: true }); await sleep(1000);
const pop = page.locator('[data-radix-popper-content-wrapper], [role=dialog]').last(); const icons = pop.locator('button'); await icons.nth(4).click({ force: true }); await sleep(600); await icons.nth(24).click({ force: true }).catch(() => {}); await sleep(600);
await page.keyboard.press('Escape'); await sleep(500);
const resp = []; page.on('response', r => { const q = r.request(); if (q.method() !== 'GET' && /teamspaces/.test(q.url())) resp.push(q.method() + ' ' + q.url().replace(/^.*\/api\/v1/, '') + ' → ' + r.status()); });
const sv = page.getByRole('button', { name: /^Save/ }).last(); if (await sv.count()) { await sv.click({ force: true }); await sleep(4000); }
await shot('1678-04-saved');
const t = (await api('GET', `/teamspaces/${id}`)).j?.data; const acl = (await api('GET', `/teamspaces/${id}/acl`)).j?.data?.rows;
out.resp = resp; out.icon = t?.icon; out.iconColor = t?.iconColor; out.desc = t?.description; out.admins = (acl || []).filter(r => r.access_level === 'admin').map(r => r.principal_id.slice(0, 8));
return done(out);

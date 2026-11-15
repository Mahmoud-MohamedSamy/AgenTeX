const R = {}; const f = x => FP + x;
await openCreate();
// owner rule shows order for the default owner; switch owner away so the basic rule alone controls order
const cb = wrap('owner').locator('button[role=combobox]'); await cb.last().click(); await sleep(1500); const other = page.locator('[role=option]').filter({ hasNotText: 'ndc-staging-owner' }).first(); await other.click(); await sleep(1500);
R.orderVis0 = await vis(f('order'));
await typeIn('first_name', 'QA RT18 E6 keep'); await pick(f('type'), 'Refund'); R.orderVisRefund = await vis(f('order'));
await typeIn(f('order'), 'QA keep me'); await toTop(f('order'), 200); await shot('2987-1-typed.png'); R.b1 = { order: await fbox(f('order')), type: await fbox(f('type')) };
await pick(f('type'), 'Question'); R.orderVisQ = await vis(f('order')); await toTop(f('type'), 300); await shot('2987-2-hidden-before-save.png'); R.b2 = { type: await fbox(f('type')), secA: await box(page.getByText('QA RT18 Sec A', { exact: true }).first()) };
const resp = page.waitForResponse(r => /\/records$/.test(r.url().split('?')[0]) && r.request().method() === 'POST', { timeout: 30000 }).catch(() => null);
await page.getByRole('button', { name: /^Save$/ }).last().click(); const rr = await resp; R.post = rr ? rr.status() : null;
let body = null; try { body = rr ? await rr.json() : null; } catch (e) {} const id = body && body.data && body.data.id; R.id = id; await sleep(4000);
if (id) { LED('record "QA RT18 E6 keep" ' + id + ' (Leads)'); const g = await api('GET', '/modules/' + MID + '/records/' + id); const d = JSON.parse(g.t).data.data; const v = n => { const x = d.find(y => y.field === n); return x ? x.value : null; }; R.saved = { type: v(f('type')), order: v(f('order')) }; }
R.reqBody = rr ? (rr.request().postData() || '').match(/qa_rt18_order[^}]*}/) : null;
R.url = page.url().slice(-60);
return R;

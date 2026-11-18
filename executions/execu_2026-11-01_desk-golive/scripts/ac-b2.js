const pr = async (m, p, b) => { const r = await api(m, p, b); return r.s + (r.s >= 300 ? ' ' + ((r.j && r.j.error && (r.j.error.message || r.j.error.code)) || r.t.slice(0, 60)).slice(0, 120) : ''); };
const ds = D((await api('GET', '/desk/departments?limit=60')).j); const L = (ds.items || ds).filter(d => d.is_active !== false && d.id !== DEP.SAL);
const P = '/desk/tickets/' + TK.MV3;
out.s11 = await pr('PUT', P + '/shares', { shares: L.slice(0, 11).map(d => ({ department_id: d.id, access: 'read_only' })) });
out.s10 = await pr('PUT', P + '/shares', { shares: L.slice(0, 10).map(d => ({ department_id: d.id, access: 'read_only' })) });
out.own = await pr('PUT', P + '/shares', { shares: [{ department_id: DEP.SAL, access: 'full' }] });
out.badAcc = await pr('PUT', P + '/shares', { shares: [{ department_id: DEP.CS, access: 'owner' }] });
out.unknown = await pr('PUT', P + '/shares', { shares: [{ department_id: '00000000-0000-0000-0000-0000000000ab', access: 'full' }] });
out.dup = await pr('PUT', P + '/shares', { shares: [{ department_id: DEP.CS, access: 'full' }, { department_id: DEP.CS, access: 'read_only' }] });
out.clear = await pr('PUT', P + '/shares', { shares: [] });
const h = JSON.stringify(D((await api('GET', P + '/history')).j)); out.histShare = (h.match(/ticket\.(shared|unshared|share[a-z_]*)/g) || []).slice(0, 6);
// UI dialog
await go('/views/all/tickets/' + TK.MV3, 9000); await clickItem('Share'); out.dlg = await dlg();
const add = page.getByRole('button', { name: /Add department/ }).first(); await add.click().catch(() => {}); await sleep(1500);
out.opts = (await page.locator('[role=listbox],[role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' | ').slice(0, 300); await shot('access/b-share-dialog');
await page.keyboard.press('Escape'); await page.keyboard.press('Escape');
return fin({ out });

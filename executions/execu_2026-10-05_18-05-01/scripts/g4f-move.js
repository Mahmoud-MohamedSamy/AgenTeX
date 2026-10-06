// G8 complete: Delete → confirm → Move records dialog → pick the default layout → confirm; verify records moved.
const QA = arr((await api('GET', '/modules')).j.data).find(m => m.moduleKey === 'desk_qa_mf_assets');
const lays = async () => arr((await api('GET', `/modules/${QA.id}/layouts`)).j.data);
const DEF = (await lays()).find(x => x.isDefault), OTH = (await lays()).find(x => !x.isDefault);
const recs = arr((await api('GET', `/modules/${QA.id}/records?page_size=50`)).j.data);
await go(`/settings/modules-and-fields/${QA.id}`, 6000);
const row = page.locator('tr', { hasText: OTH.name }).first(); await row.hover(); await sleep(300);
await page.locator(`button[aria-label="Open menu for ${OTH.name}"]`).first().click(); await sleep(700);
await page.locator('button,[role=menuitem]', { hasText: /^Delete$/ }).last().click({ force: true }); await sleep(1200);
await page.locator('[role=dialog] button, [role=alertdialog] button').filter({ hasText: /^Delete$/ }).last().click({ force: true }); await sleep(2000);
const d = page.locator('[role=dialog],[role=alertdialog]').last();
const opts = await d.locator('select option').allInnerTexts().catch(() => []);
if (await d.locator('select').count()) await d.locator('select').first().selectOption({ label: DEF.name }).catch(() => { });
else { await d.locator('button', { hasText: DEF.name }).first().click().catch(() => { }); await sleep(500); await page.getByRole('option', { name: DEF.name }).first().click().catch(async () => page.locator('li,[role=option]', { hasText: DEF.name }).last().click()); await sleep(500); }
const s = await shot('G8-move-records-dialog');
await d.locator('button', { hasText: /^Move records$/ }).first().click(); await sleep(4000);
const gone = !(await lays()).some(x => x.id === OTH.id);
const moved = []; for (const r of recs) { const g = (await api('GET', `/modules/${QA.id}/records/${r.id}`)).j; const lid = g && g.data && (g.data.layout_id || g.data.layoutId); moved.push(lid === DEF.id); }
rec('G8', gone && moved.every(Boolean) ? 'PASS' : 'FAIL', `two-step delete: confirm → "Move records before this layout is deleted" with targets [${opts.join(', ')}]; after Move: layout deleted=${gone}; ${moved.filter(Boolean).length}/${moved.length} records now on "${DEF.name}"`, { shot: s });
return done();

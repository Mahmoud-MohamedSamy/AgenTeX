// Reproduce: set-default 500 on an active layout with records; confirm Delete on a layout with records (QA objects).
const QA = arr((await api('GET', '/modules')).j.data).find(m => m.moduleKey === 'desk_qa_mf_assets');
const lays = async () => arr((await api('GET', `/modules/${QA.id}/layouts`)).j.data);
const DEF = (await lays()).find(x => x.isDefault), OTH = (await lays()).find(x => !x.isDefault);
const tries = [];
for (let i = 0; i < 2; i++) { const r = await api('POST', `/modules/${QA.id}/layouts/${OTH.id}/set-default`); tries.push(`${r.s} ${((r.j && r.j.error && r.j.error.message) || '').slice(0, 90)}`); if (r.s < 300) { await api('POST', `/modules/${QA.id}/layouts/${DEF.id}/set-default`); } }
rec('G6', tries.every(t => /^500/.test(t)) ? 'FAIL' : 'INFO', `set-default on active non-default layout "${OTH.name}" (6 records) — attempt 1: ${tries[0]} | attempt 2: ${tries[1]}. Switching it off opens the correct "Move records before this layout is disabled" dialog (not completed)`, { severity: 'Medium' });
// G8 confirm delete with records
await go(`/settings/modules-and-fields/${QA.id}`, 6000);
const row = page.locator('tr', { hasText: OTH.name }).first(); await row.hover(); await sleep(300);
await page.locator(`button[aria-label="Open menu for ${OTH.name}"]`).first().click(); await sleep(700);
await page.locator('button,[role=menuitem]', { hasText: /^Delete$/ }).last().click({ force: true }); await sleep(1200);
await page.locator('[role=dialog] button, [role=alertdialog] button').filter({ hasText: /^Delete$/ }).last().click({ force: true }); await sleep(3000);
const t = (await txt()).replace(/\s+/g, ' '); const dlg2 = (await page.locator('[role=dialog],[role=alertdialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
const still = (await lays()).some(x => x.id === OTH.id); const s = await shot('G8-after-confirm-delete');
const msg = (t.match(/[^.]{0,80}(record|Failed to delete layout|Move records)[^.]{0,120}/) || [''])[0];
rec('G8', !still ? 'INFO' : 'FAIL', `confirm Delete on "${OTH.name}" with 6 records: layout still exists=${still}; follow-up dialog "${dlg2.slice(0, 160)}"; page message "${msg.slice(0, 200)}"`, { shot: s, severity: 'Medium' });
await page.keyboard.press('Escape');
return done();

// G14 (Quick Create one section) and G15 (Preview) re-check with correct locators; no save.
const QA = arr((await api('GET', '/modules')).j.data).find(m => m.moduleKey === 'desk_qa_mf_assets');
const DEF = arr((await api('GET', `/modules/${QA.id}/layouts`)).j.data).find(x => x.isDefault);
await go(`/settings/modules-and-fields/${QA.id}/layouts/${DEF.id}`, 10000);
await page.locator('button.mf-tab', { hasText: 'QUICK CREATE' }).first().click(); await sleep(1200);
const nsCanvas = page.locator('main button', { hasText: 'NEW SECTION' });
const n = await nsCanvas.count(); const disabled = n ? await nsCanvas.last().isDisabled() : null;
let msg = false; if (n && !disabled) { await nsCanvas.last().click().catch(() => { }); await sleep(800); msg = (await txt()).includes('Quick Create supports only 1 section'); }
const palette = await page.locator('button[title*="Quick Create supports only 1 section"], [title*="Quick Create supports only 1 section"]').count();
const secs = await page.getByRole('button', { name: 'Section settings' }).count();
rec('G14', (disabled || msg || palette > 0 || n === 0) && secs <= 1 ? 'PASS' : 'FAIL', `Quick Create: NEW SECTION buttons=${n}, disabled=${disabled}, message on click=${msg}, hint title present=${palette > 0}; sections in canvas=${secs}`);
await page.locator('button.mf-tab', { hasText: /^CREATE/ }).first().click(); await sleep(800);
await page.locator('button', { hasText: /^Preview$/ }).first().click(); await sleep(1500);
const t = (await txt()).replace(/\s+/g, ' ');
const ok = /Preview as/.test(t) || /Preview —/.test(t);
const s = await shot('G15-preview');
rec('G15', ok ? 'PASS' : 'FAIL', `Preview opened: ${ok}; shows view switch Create/Quick Create/Detail View: ${/Quick Create/.test(t) && /Detail View/.test(t)}`, { shot: s });
await page.keyboard.press('Escape');
return done();

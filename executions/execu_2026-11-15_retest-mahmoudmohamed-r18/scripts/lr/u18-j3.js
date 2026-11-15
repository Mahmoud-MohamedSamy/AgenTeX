const R = {}; const f = x => FP + x;
await openCreate(); R.dateInDom = await page.locator(`[data-rule-field=${f('date')}]`).count();
R.noteReq0 = await reqInfo(f('note')); await tick(f('vip'), true); R.noteReqVip = await reqInfo(f('note'));
await toTop(f('order'), 220); await shot('2982-1-form-vip-ticked.png'); R.b1 = { note: await fbox(f('note')), vip: await fbox(f('vip')) };
// try save without note
await typeIn('first_name', 'QA RT18 J3 check'); const resp = page.waitForResponse(r => /\/records$/.test(r.url().split('?')[0]) && r.request().method() === 'POST', { timeout: 15000 }).catch(() => null);
await page.getByRole('button', { name: /^Save$/ }).last().click(); const rr = await resp; R.post = rr ? rr.status() : 'no request'; await sleep(2500);
R.errs = await grab(/[^.]{0,40}QA RT18 note[^.]{0,60}(required)[^.]{0,20}/gi); await toTop(f('order'), 220); await shot('2982-2-save-blocked.png'); R.b2 = { note: await fbox(f('note')) };
if (rr && rr.status() < 300) { try { const j = await rr.json(); LED('record "QA RT18 J3 check" ' + j.data.id + ' (Leads)'); R.createdId = j.data.id; } catch (e) {} }
await openRules(); const row = page.locator('tr', { hasText: 'QA RT18 vip' }).first(); R.rowTxt = (await row.innerText()).replace(/\s+/g, ' '); R.rowWarn = await row.innerHTML().then(h => /alert|triangle|warn/i.test(h)); await shot('2982-3-list.png'); R.bRow = await box(row);
await row.locator('button').nth(1).click(); await sleep(4500); R.editorFlag = await grab(/[^.]{0,80}(not on this layout|No longer on this layout|does not apply|stale)[^.]{0,80}/gi); await shot('2982-4-editor.png'); R.bFlag = await box(page.getByText(/not on this layout|No longer on this layout/).first());
return R;

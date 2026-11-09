const o = {}; const ID = '3eeae90e-e61b-47df-add9-3e1c5e840150'; const U = H + '/settings/organization/departments/' + ID;
const openForm = async pg => { await pg.goto(U, { waitUntil: 'commit', timeout: 45000 }).catch(() => {}); for (let i = 0; i < 30; i++) { await pg.waitForTimeout(1000); const t = await pg.innerText('body').catch(() => ''); if (/Allow copied addresses/.test(t)) break; } await pg.waitForTimeout(1500); };
const saveBtn = pg => pg.getByRole('button', { name: /^(Save|Save changes|Update)$/i });
const cb = (pg, re) => pg.locator('label', { hasText: re }).first();
const get = async () => (await api('GET', '/desk/departments/' + ID)).j.data;
const body = x => ({ name: x.name, description: x.description, visibility: x.visibility, help_center_display_name: x.help_center_display_name, cc_enabled: x.cc_enabled, auto_private_non_contacts: x.auto_private_non_contacts, send_as_email_enabled: x.send_as_email_enabled, mass_comments_enabled: x.mass_comments_enabled, scheduled_replies_enabled: x.scheduled_replies_enabled, scheduled_reply_cancel_on_customer_reply: x.scheduled_reply_cancel_on_customer_reply, scheduled_reply_cancel_on_close: x.scheduled_reply_cancel_on_close, routing_strategy: x.routing_strategy, logo_file_id: x.logo_file_id });
const g0 = await get(); o.reset = (await api('PATCH', '/desk/departments/' + ID, { ...body(g0), cc_enabled: true })).s;
// W1-22
await openForm(page); const hcBox = page.locator('input[type=checkbox]').nth(0); o.w22before = await hcBox.isChecked().catch(() => 'n/a');
await cb(page, /^Display in Help Center/).click(); await sleep(800); o.w22checkedNow = await hcBox.isChecked().catch(() => 'n/a');
o.saveVisible = await saveBtn(page).count(); o.saveEnabled = o.saveVisible ? await saveBtn(page).first().isEnabled() : false;
if (o.saveEnabled) { await saveBtn(page).first().click(); await sleep(4000); }
o.w22after = (await get()).visibility; o.w22shot = await shot('ndc/W1-22-after-save');
if (o.w22after === 'public') { await openForm(page); await cb(page, /^Display in Help Center/).click(); await sleep(800); if (await saveBtn(page).count()) { await saveBtn(page).first().click(); await sleep(4000); } }
o.w22final = (await get()).visibility;
// W1-B2
const pa = page, pb = await page.context().newPage();
await openForm(pa); await openForm(pb);
o.b2_0 = await get().then(x => ({ cc: x.cc_enabled, hc: x.help_center_display_name }));
await pa.screenshot({ path: SHOT + '/bugs/W1-B2-1-tabA-open.png' });
await cb(pa, /^Allow copied addresses/).click(); await pa.waitForTimeout(800); await saveBtn(pa).first().click(); await pa.waitForTimeout(4000);
await pa.screenshot({ path: SHOT + '/bugs/W1-B2-2-tabA-cc-off-saved.png' });
o.b2_afterA = await get().then(x => ({ cc: x.cc_enabled, hc: x.help_center_display_name }));
const hc = pb.locator('input[type=text]').nth(1);
await hc.fill('QA GL N HC name'); await pb.waitForTimeout(600);
await pb.screenshot({ path: SHOT + '/bugs/W1-B2-3-tabB-stale-edit.png' });
await saveBtn(pb).first().click(); await pb.waitForTimeout(4000);
await pb.screenshot({ path: SHOT + '/bugs/W1-B2-4-tabB-saved.png' });
o.b2_afterB = await get().then(x => ({ cc: x.cc_enabled, hc: x.help_center_display_name }));
await openForm(pa); await pa.screenshot({ path: SHOT + '/bugs/W1-B2-5-reload-cc-on.png' });
await pb.close().catch(() => {});
return done(o);

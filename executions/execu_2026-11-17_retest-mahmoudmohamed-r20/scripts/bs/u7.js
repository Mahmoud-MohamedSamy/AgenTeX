// one case: enter in Open state, Save state, Save Draft, return stored minutes from the save response, then reload and reopen
const out = {}; const BP = '5392f456-66f9-4bc7-aa95-99bad990f4d5'; const [dv, du, wv, wu] = JSON.parse(process.env.C); const K = process.env.K; const X = +(process.env.NX || 385);
const open = async () => { await page.goto(H + '/settings/automation/blueprints/' + BP, { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 60; i++) { await sleep(2000); const tt = await text(); if (/QA a3/.test(tt)) break; if (/502 Bad Gateway/.test(tt) && i % 5 == 4) await page.reload({ waitUntil: 'domcontentloaded' }); } await sleep(1500); };
const node = async () => { const n = page.locator('.react-flow__node').filter({ hasText: process.env.NODE || 'Open' }).first(); if (await n.count()) await n.click(); else await page.mouse.click(X, 506); await sleep(2000); };
const f = (l, t) => page.getByText(l, { exact: true }).locator('xpath=following::' + t + '[1]');
const read = async () => [await f('Due after', 'input').inputValue(), await f('Due after', 'select').evaluate(s => s.options[s.selectedIndex].text), await f('Warn before', 'input').inputValue(), await f('Warn before', 'select').evaluate(s => s.options[s.selectedIndex].text)];
await open(); await node(); out.before = await read();
await f('Due after', 'input').fill('1'); await f('Due after', 'select').selectOption({ label: du }); await f('Due after', 'input').fill(String(dv)); out.warnEnabled = await f('Warn before', 'select').isEnabled(); if (out.warnEnabled) { await f('Warn before', 'select').selectOption({ label: wu }); await f('Warn before', 'input').fill(String(wv)); } await sleep(1000);
out.shown = await read(); out.inlineErr = (await text()).replace(/s+/g,' ').match(/Due after.{0,200}/)?.[0];
const pan = async () => (await page.locator('body').innerText()).replace(/\s+/g, ' ').match(/Time limit.{0,700}/)?.[0];
out.panel = await pan();
out.saveStateEnabled = await page.getByRole('button', { name: 'Save state', exact: true }).isEnabled();
await shot('3063-' + K + '-entered.png');
if (out.saveStateEnabled) { await page.getByRole('button', { name: 'Save state', exact: true }).click(); await sleep(1500); }
out.toast = (await page.locator('[role=status], [role=alert], [data-sonner-toast]').allInnerTexts().catch(() => [])).join(' | ').slice(0, 400);
out.panelAfter = await pan(); out.issues = (await text()).replace(/s+/g,' ').match(/d+ issues? to fix.{0,300}/)?.[0]; await shot('3063-' + K + '-savestate.png');
out.saveDraftEnabled = await page.getByRole('button', { name: 'Save Draft', exact: true }).isEnabled();
if (out.saveDraftEnabled) { const resp = page.waitForResponse(r => /blueprints/.test(r.url()) && ['PUT', 'PATCH', 'POST'].includes(r.request().method()), { timeout: 30000 }).catch(() => null); await page.getByRole('button', { name: 'Save Draft', exact: true }).click(); const rr = await resp; if (rr) { out.draftStatus = rr.status(); const j = await rr.json().catch(() => null); out.stored = (j?.data?.definition?.states || []).map(s => [s.id, s.slaMinutes, s.slaPreExpiryMinutes, s.autoTransitionAfterMinutes]); if (rr.status() >= 300) out.err = JSON.stringify(j).slice(0, 500); } await sleep(2500); out.toast2 = (await page.locator('[role=status], [role=alert], [data-sonner-toast]').allInnerTexts().catch(() => [])).join(' | ').slice(0, 400); }
await open(); await node(); out.reopen = await read(); await shot('3063-' + K + '-reopen.png');
return out;

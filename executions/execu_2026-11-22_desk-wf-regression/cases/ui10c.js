await page.goto(H + '/settings/automation/workflow-rules', { waitUntil: 'domcontentloaded' }); await sleep(8000); if (await page.locator('input[type=password]').count()) { await shot('UIAC10-0-login'); return { stopped: 'saved session not valid, no second sign-in', url: page.url() }; }
const RID = JSON.parse(require('fs').readFileSync('out/ui10.json', 'utf8')).RID; const out = {};
const clean = s => (s || '').replace(/\s+/g, ' ');
await go('/settings/automation/workflow-rules/' + RID); await page.waitForLoadState('networkidle').catch(() => {}); await sleep(6000);
await shot('UIAC10-1-rule');
await page.getByRole('button', { name: /^Add action$/ }).first().click(); await sleep(1500); await shot('UIAC10-2-picker');
out.picker = clean(await page.locator('[role=dialog], [role=menu], [role=listbox]').last().innerText().catch(() => '')).slice(0, 600);
await page.locator('button').filter({ hasText: /^Owner Assignment/ }).first().click(); await sleep(2000);
const card = page.locator('main').getByText('ASSIGN OWNER TO', { exact: false }).last(); await card.scrollIntoViewIfNeeded(); await sleep(800);
await shot('UIAC10-3-owner-form');
const t = clean(await page.locator('main').innerText()); const i = t.lastIndexOf('ASSIGN OWNER TO'); out.form = t.slice(i, i + 700);
out.controls = await page.$$eval('main [role=radio], main [role=tab], main [role=combobox], main select, main button', els => els.map(e => (e.getAttribute('role') || e.tagName) + ':' + (e.innerText || e.getAttribute('aria-label') || e.value || '').trim().slice(0, 50)).filter(x => !/^BUTTON:$/.test(x)).slice(-40));
return out;

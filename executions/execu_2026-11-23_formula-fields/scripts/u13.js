await page.goto(H + `/settings/modules-and-fields/${made.mod}/layouts/${made.layouts[0]}`, { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); if (/QA FX Checks/.test(await text())) break; } await sleep(2000);
const card = page.locator("div").filter({ has: page.locator("input[value=\"QA Items 3\"]") }).last(); await card.scrollIntoViewIfNeeded().catch(()=>{}); const ln = page.getByText("Line", { exact: true }).first(); await ln.scrollIntoViewIfNeeded(); const lb = await ln.boundingBox(); log("line box", lb); await page.mouse.click(lb.x + 93, lb.y + 16); await sleep(1200); await shot("F8-menu"); log("menu", (await page.locator("[role=menu]").allInnerTexts()).join(" | ")); const it = page.getByRole("menuitem").filter({ hasText: /propert|edit|setting/i }).first(); if (await it.count()) { await it.click(); await sleep(2000); }
await page.getByText('ADVANCED', { exact: true }).click().catch(() => { }); await sleep(1500); await shot('F8-subform-advanced');
const box = page.locator('[data-testid^="subform-formula-"] textarea').first(); log('formula boxes', await page.locator('[data-testid^="subform-formula-"]').count(), 'value', await box.inputValue().catch(() => '?'));
const msg = async () => (await page.locator('[data-testid^="subform-formula-"]').first().innerText()).split('\n').slice(0, 2).join(' / ');
const out = {};
for (const [k, e] of Object.entries({ F9: 'qa_items3.qty * 2', F10self: 'line + 1', unknown: 'nope * 2', ok: 'qty * price' })) { await box.fill(e); await sleep(500); out[k] = { e, msg: await msg() }; }
await box.fill('line + 1'); await sleep(300); await shot('F10-self-ref');
await page.getByRole('button', { name: 'Apply' }).click().catch(() => { }); await sleep(800);
await page.getByRole('button', { name: 'Save', exact: true }).click({ force: true }).catch(() => { }); await sleep(4000); out.saveWithBad = (await page.locator('[data-sonner-toast], li[role=status], [role=alert]').allInnerTexts()).join(' || ').slice(0, 300); await shot('F10-save-blocked');
for (const [k, v] of Object.entries(out)) log(k, JSON.stringify(v));

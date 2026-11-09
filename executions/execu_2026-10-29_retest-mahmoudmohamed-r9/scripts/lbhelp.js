// layout-builder helpers (prepended by rcl.sh)
const drag = async (label, tx, ty) => { const all = label instanceof RegExp ? page.getByText(label) : page.getByText(label, { exact: true }); let b = null;
  for (let i = 0; i < await all.count(); i++) { const bb = await all.nth(i).boundingBox(); if (bb && bb.x < 340 && bb.y > 100 && bb.y < 720) { b = bb; break; } }
  if (!b) throw new Error('palette item not visible: ' + label);
  await page.mouse.move(b.x + 20, b.y + 8); await page.mouse.down(); await sleep(200);
  for (let i = 1; i <= 25; i++) { await page.mouse.move(b.x + 20 + (tx - b.x - 20) * i / 25, b.y + 8 + (ty - b.y - 8) * i / 25); await sleep(40); } await sleep(300); await page.mouse.up(); await sleep(2500); };
const panelText = async () => { const t = await txt(); return t.includes('Field Properties') ? t.split('Field Properties')[1].slice(0, 2000) : null; };
const inputsIn = async () => page.locator('input:visible, textarea:visible').evaluateAll(a => a.map(x => ({ ph: x.placeholder, id: x.id, name: x.name, val: x.value, ro: x.readOnly || x.disabled })).filter(x => x.ph || x.id || x.name));
const rowMenu = async (label, item) => { const t = page.getByText(label, { exact: true }).first(); await t.scrollIntoViewIfNeeded(); const rb = await t.boundingBox(); await page.mouse.move(rb.x + 100, rb.y + 5); await sleep(500);
  const bs = page.locator('button[aria-label="Field options"]:visible'); let k = -1; for (let i = 0; i < await bs.count(); i++) { const bb = await bs.nth(i).boundingBox(); if (bb && Math.abs(bb.y - rb.y) < 30) { k = i; break; } }
  await bs.nth(k).click({ force: true }); await sleep(800); if (item) { await page.getByText(item).last().click({ force: true }); await sleep(1200); } };
const relabel = async (from, to) => { await rowMenu(from, /Edit Properties/i); await page.getByText('GENERAL', { exact: true }).last().click({ force: true }); await sleep(600); await page.getByPlaceholder('Label in English').fill(to); await sleep(300); await page.getByRole('button', { name: 'Apply', exact: true }).last().click(); await sleep(1500); };

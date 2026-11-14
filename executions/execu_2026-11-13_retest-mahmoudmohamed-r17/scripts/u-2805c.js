const L = process.env.LID;
await page.goto(H + '/settings/modules-and-fields/88e8ea44-1658-4df3-9930-d0902b91073d/layouts/' + L, { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 60; i++) { await sleep(2000); if (await page.getByText('Skills', { exact: true }).count() > 0 && /Save/.test(await text())) break; } await sleep(4000);
const c = page.getByText('Skills', { exact: true }); let lab = null; for (let i = 0; i < await c.count(); i++) { const bb = await c.nth(i).boundingBox().catch(() => null); if (bb && bb.x > 340) { await c.nth(i).scrollIntoViewIfNeeded(); await c.nth(i).hover(); lab = await c.nth(i).boundingBox(); break; } }
log('lab', lab); await sleep(600);
const btns = page.locator('[title="Field options"], [aria-label="Field options"]'); let best = null, bd = 1e9;
for (let i = 0; i < await btns.count(); i++) { const bb = await btns.nth(i).boundingBox().catch(() => null); if (!bb) continue; const dy = Math.abs((bb.y + bb.height / 2) - (lab.y + lab.height / 2)); if (bb.x > lab.x && dy < 30 && dy < bd) { bd = dy; best = btns.nth(i); } }
await best.click(); await sleep(1000); log('menu', await page.locator('[role=menuitem]').allInnerTexts());
await page.getByText('Edit Properties', { exact: true }).first().click(); await sleep(2000);
const pt = async () => { const t = await text(); const i = t.indexOf('Field Properties'); return t.slice(i, i + 1500); };
log('general:', await pt()); await shot('2805-skills-props.png');
await page.getByText('ADVANCED', { exact: true }).first().click(); await sleep(1500);
log('advanced:', await pt()); await shot('2805-skills-advanced.png');
await page.getByText('VALIDATION', { exact: true }).first().click(); await sleep(1200); log('validation:', await pt()); await shot('2805-skills-validation.png');
await page.getByRole('button', { name: /^Cancel$/ }).last().click().catch(() => {}); await sleep(800);

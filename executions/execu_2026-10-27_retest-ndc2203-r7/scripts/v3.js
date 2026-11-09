const out = {};
const openHist = async () => { for (let i = 0; i < 4; i++) { const h = page.getByText(/^History$/i).first(); if (await h.isVisible().catch(() => false)) { await h.click(); await sleep(4000); return true; } const nx = page.locator('button:right-of(:text("PARENT-CHILD"))').first(); await nx.click().catch(() => {}); await sleep(700); } return false; };
await go('/views/all/tickets/1e0ca0fe-db47-4b9c-b718-1c6327e68888', 12000); await openHist();
const dRow = page.getByText('Department changed', { exact: true }).first(); await dRow.scrollIntoViewIfNeeded().catch(() => {}); await sleep(800); await shot('v3-651-dept-create');
out.create = (await txt()).split('\n').filter(l => /Department changed|department_id|7e1ac409|Customer Support/.test(l)).slice(0, 8);
await go('/views/all/tickets/df2b2aa7-282b-43dd-8a7d-4ef002dbeb0e', 12000);
const chip = page.getByText('Customer Support', { exact: true }).first(); await chip.click().catch(e => out.chipErr = String(e.message).slice(0, 80)); await sleep(1500);
await shot('v3-656-move-open'); out.moveUi = (await txt()).split('\n').filter(l => /Move|HR|department/i.test(l)).slice(0, 12);
return done(out);

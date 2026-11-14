const M = page.locator('main');
await go('/modules/' + KM + '/records/new', 10000);
await M.getByPlaceholder('Contract Name').fill('QA GL W3 Contract');
await M.getByRole('button', { name: 'Department' }).click(); await sleep(1200); out.deptOpts = (await page.locator('[role=listbox],[role=menu],[role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200);
await page.getByRole('option', { name: 'Marketing' }).first().click().catch(() => page.getByText('Marketing', { exact: true }).last().click()); await sleep(1500); await shot('w3/W3-05-after-dept');
out.btns = await M.locator('button').evaluateAll(es => es.filter(e => e.offsetParent).map(e => (e.getAttribute('aria-label')||'')+'/'+(e.innerText||'').trim().slice(0,30)).slice(8,20));
await M.getByText('Choose a record').first().click(); await sleep(1500);
const pop = page.locator('[role=dialog],[role=listbox]').last(); const inp = pop.locator('input').first(); if (await inp.count()) await inp.fill('QA GL W3 Account'); await sleep(3000);
out.accPop = (await pop.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300);
await page.getByText('QA GL W3 Account', { exact: true }).last().click().catch(e => out.accErr = 'pick failed'); await sleep(1000); await pop.getByRole('button', { name: 'Select', exact: true }).click().catch(e => out.selErr = 'no select'); await sleep(2000);
const today = new Date().toISOString().slice(0, 10); await M.locator('input[type=date]').nth(0).fill(today); await M.locator('input[type=date]').nth(1).fill('2027-11-12');
await M.getByRole('button', { name: 'Support Plan' }).click(); await sleep(2000); out.planOpts = (await page.locator('[role=listbox],[role=menu],[role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400);
await page.getByText('QA GL W3 Allowance', { exact: true }).last().click().catch(e => out.planErr = 'pick failed'); await sleep(1200);
await shot('w3/W3-05-contract-filled');
await M.getByRole('button', { name: 'Save', exact: true }).click(); await sleep(6000);
out.afterUrl = page.url().replace(H, ''); out.toast = (await page.locator('[data-sonner-toast],[role=status],[role=alert]').allInnerTexts().catch(() => [])).join(' | ').slice(0, 300); out.after = (await mtxt()).slice(0, 700); await shot('w3/W3-05-contract-saved');
const m = out.afterUrl.match(/records\/([0-9a-f-]{36})/); if (m) { CREATED.push({ kind: 'contract', id: m[1], name: 'QA GL W3 Contract' }); out.rec = await get(KM, m[1]); }
return fin({ out });

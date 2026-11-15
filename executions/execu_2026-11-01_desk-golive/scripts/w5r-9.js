const ACC = 'cc6244cd-863f-4e23-8e2e-1f528dd72787';
await go('/modules/' + KM + '/records/new', 10000);
await page.getByLabel(/Contract Name/i).first().fill('QA GL W5R Contract');
const fieldBtn = label => page.getByText(new RegExp('^[*]?' + label + '$')).first().locator('xpath=following::*[self::button or @role="combobox" or self::input][1]');
// department
try { await fieldBtn('Department').click(); await sleep(1500); const s = page.locator('[role=dialog] input, [role=listbox] input, [cmdk-input], input[placeholder*=earch]').last(); if (await s.count()) { await s.fill('Marketing').catch(() => {}); await sleep(1500); } await page.getByRole('option', { name: /^Marketing$/ }).first().click(); out.dep = 'ok'; } catch (e) { out.depErr = e.message.slice(0, 100); }
await sleep(1000);
// account
try { await fieldBtn('Account').click(); await sleep(2500); const dl = page.locator('[role=dialog]').last(); const srch = dl.locator('input[type=search], input[placeholder*=earch]').first(); if (await srch.count()) { await srch.fill('QA GL W5R'); await sleep(2500); }
  const row = dl.getByRole('row').filter({ hasText: 'QA GL W5R Account' }).first(); if (await row.count()) { await row.getByRole('checkbox').check().catch(async () => row.click()); } else await dl.getByText('QA GL W5R Account', { exact: true }).click();
  await sleep(800); await dl.getByRole('button', { name: 'Select' }).click(); await sleep(2000); out.acc = 'ok'; } catch (e) { out.accErr = e.message.slice(0, 100); await shot('w5r/W5-16-acc-err'); }
// plan
try { await fieldBtn('Support Plan').click(); await sleep(2500); out.planOpts = (await page.locator('[role=listbox], [role=dialog], [role=menu]').last().innerText()).replace(/\s+/g, ' ').slice(0, 300); await shot('w5r/W5-16-plan-picker'); await page.getByText('QA GL W5R Plan').last().click(); await sleep(1200); out.plan = 'ok'; } catch (e) { out.planErr = e.message.slice(0, 100); }
const sd = page.getByLabel(/Start Date/i).first(); await sd.fill('2026-11-01').catch(e => out.sdErr = e.message.slice(0, 60));
const ed = page.getByLabel(/End Date/i).first(); await ed.fill('2027-10-31').catch(e => out.edErr = e.message.slice(0, 60));
await sleep(800); await shot('w5r/W5-16-contract-form');
const n0 = NET.length; await page.getByRole('button', { name: /^Save$/ }).first().click(); await sleep(6000);
const cr = NET.slice(n0).find(x => x.m === 'POST' && /records/.test(x.u)); out.create = cr ? cr.s + ' ' + cr.t.slice(0, 300) : 'none';
out.after = page.url().replace(H, ''); out.msg = (await mtxt()).match(/.{0,80}(required|invalid|error|no active).{0,80}/i)?.[0];
const m = (cr && cr.t || '').match(/"id":"([0-9a-f-]{36})"/); if (m && cr.s < 300) CREATED.push({ kind: 'contract', id: m[1], name: 'QA GL W5R Contract' });
await shot('w5r/W5-16-contract-saved');
return fin({ out });

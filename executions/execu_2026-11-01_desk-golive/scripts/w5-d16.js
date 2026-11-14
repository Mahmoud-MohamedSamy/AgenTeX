const G = []; const onG = async r => { const u = r.url(); if (/reporting\/(query|datasets)/.test(u)) { let t = ''; try { t = await r.text(); } catch (e) {} G.push({ u: u.replace(API, '').slice(0, 100), b: (r.request().postData() || '').slice(0, 300), t }); } }; page.on('response', onG);
await go('/analytics/reports/builder', 4000); await page.getByRole('button', { name: 'Select Primary Module' }).waitFor({ timeout: 60000 });
await page.getByLabel('Report Name').fill('QA GL W5 probe (not saved)');
await page.getByRole('button', { name: 'Select Primary Module' }).click(); await sleep(1500);
await page.getByRole('option', { name: /^Ticket Metrics/ }).first().click(); await sleep(1000);
await page.getByRole('button', { name: /^Create$/ }).click();
for (let i = 0; i < 20; i++) { await sleep(2000); if (/Continue/.test(await mtxt())) break; }
await page.getByRole('button', { name: /^Continue$/ }).click();
for (let i = 0; i < 15; i++) { await sleep(2000); if (/Edit columns/.test(await mtxt())) break; }
await page.getByRole('button', { name: 'Edit columns' }).click(); await sleep(1500); const d = page.locator('[role=dialog]').last();
out.fields = (await d.innerText()).replace(/\s+/g, ' ').slice(0, 1500);
for (const f of ['Ticket Number', 'Status Type', 'Status']) { await d.getByPlaceholder('Search fields…').fill(f); await sleep(700); await d.getByText(new RegExp('^' + f + '$')).first().click().catch(e => out['miss_' + f] = 1); }
await d.getByRole('button', { name: /^Done$/ }).click(); await sleep(6000);
out.preview = (await mtxt()).replace(/.*Run Preview/, '').slice(0, 1500);
page.off('response', onG); const q = G.filter(x => /query/.test(x.u)).pop(); out.q = q && q.t.slice(0, 3000);
await page.getByRole('button', { name: 'Cancel' }).first().click().catch(() => {});
return fin({ out });

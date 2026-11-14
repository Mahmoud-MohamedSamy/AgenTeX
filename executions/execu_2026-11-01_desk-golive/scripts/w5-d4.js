const G = []; const onG = async r => { const u = r.url(); if (u.includes('/reporting/') && r.request().method() === 'POST') { let t = ''; try { t = await r.text(); } catch (e) {} G.push(u.replace(API, '').slice(0, 120) + ' ' + (r.request().postData() || '').slice(0, 600) + ' => ' + t.slice(0, 300)); } }; page.on('response', onG);
await go('/analytics/dashboards/standard/overview', 12000);
const w = page.locator('main').getByText('Open Tickets', { exact: true }).first(); out.wfound = await w.count();
const n0 = G.length; await w.locator('xpath=ancestor::*[contains(., "Now")][1]').getByText(/^\d+$/).first().click().catch(e => out.cErr = e.message.slice(0, 80)); await sleep(6000);
out.after = (await page.locator('body').innerText()).replace(/\s+/g, ' ').slice(-1200); await shot('w5/W5-31-drill');
page.off('response', onG); out.G = G.filter(x => /open/i.test(x)).slice(0, 4); out.Gall = G.length;
return fin({ out });

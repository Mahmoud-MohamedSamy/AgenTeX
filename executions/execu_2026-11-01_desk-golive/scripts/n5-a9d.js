const o = {};
await page.getByText('status', { exact: true }).first().scrollIntoViewIfNeeded().catch(() => {});
await page.getByText('Status', { exact: true }).last().click().catch(e => o.e = e.message.slice(0, 60)); await sleep(3000);
o.u = page.url().replace(H, ''); o.dialog = (await page.$$eval('[role=dialog]', d => d.map(x => x.innerText.replace(/\s+/g, ' ').slice(0, 900))))[0];
o.t = o.dialog ? null : (await txt()).replace(/\s+/g, ' ').replace(/^.*?Email Providers/, '').slice(0, 600);
o.shot = await shot('a9/tavi-status-field2');
return JSON.stringify(o);

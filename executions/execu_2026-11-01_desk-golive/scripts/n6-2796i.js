const o = {}; const d = page.locator('[role=dialog]');
await d.getByText('QA NDC Accounting', { exact: true }).first().click().catch(e => o.e = e.message.slice(0, 60)); await sleep(800);
await d.locator('button', { hasText: /^Change layout$/ }).click().catch(e => o.e2 = e.message.slice(0, 60)); await sleep(5000);
const t = (await txt()).replace(/\s+/g, ' ');
o.admStill = ['QA NDC IATA Source', 'QA NDC ADM Number'].filter(f => t.includes(f)); o.msg = t.match(/.{0,40}(layout changed|Layout changed|changed to)[^.]{0,60}/i)?.[0];
o.shot = await shot('rt/2796-after-change');
return JSON.stringify(o);

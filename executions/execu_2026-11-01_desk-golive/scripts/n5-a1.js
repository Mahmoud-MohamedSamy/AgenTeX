const o = {};
await page.locator('text=/^Workflow Rules$/').first().click().catch(() => {});
for (let i = 0; i < 30; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (/QA NDC QA - GDS B2B/.test(t)) break; }
await page.locator('text=QA NDC QA - GDS B2B').first().click().catch(e => o.e = e.message.slice(0, 60));
for (let i = 0; i < 20; i++) { await sleep(1500); const t = await txt(); if (/WHEN/.test(t) && /QA - GDS B2B/.test(t)) break; }
await sleep(1500);
await page.locator('text=/^QA NDC QA - GDS B2B$/').first().click().catch(e => o.e2 = e.message.slice(0, 60)); await sleep(1500);
o.inputs = await page.$$eval('input', es => es.filter(e => e.offsetParent).map(e => e.value).slice(0, 5));
o.shot = await shot('a1/tavi-title');
return JSON.stringify(o);

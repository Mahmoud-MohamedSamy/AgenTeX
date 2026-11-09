const o = {};
await page.goto(H + '/settings/modules-and-fields/88e8ea44-1658-4df3-9930-d0902b91073d', { waitUntil: 'commit', timeout: 120000 }).catch(() => {});
for (let i = 0; i < 40; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (/QA NDC/.test(t)) break; }
await sleep(2000); o.url = page.url().replace(H, ''); o.t = (await txt()).replace(/\s+/g, ' ').replace(/^.*?Custom Actions CRM ⇄ Desk Integr\S*/, '').slice(0, 1500);
o.shot = await shot('m17/tavi-layouts-list');
return JSON.stringify(o);

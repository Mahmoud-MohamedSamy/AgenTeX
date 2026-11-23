await page.goto(H + '/modules/0924eb24-e42a-4eab-8efd-e3428f19e882/records/00645a02-40cc-4a7e-9f8d-4a1446829857', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 30; i++) { await sleep(2000); if (/QA RT20 ZC Contract 2841/.test(await text())) break; } await sleep(3000);
await shot('ZC-2841-tavi-1-record.png');
const t = (await text()).replace(/\s+/g, ' ');
return { dept: t.match(/Department.{0,60}/)?.[0], plan: t.match(/Support Plan.{0,120}/g)?.slice(0, 3), noPlan: /No support plan/i.test(t) };

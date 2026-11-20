const out = {};
await page.goto(H + '/settings/security/audit-log', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); if (/IP /.test(await text())) break; }
await sleep(3000);
const box = async el => { const b = await el.boundingBox(); return b && [Math.round(b.x), Math.round(b.y), Math.round(b.x + b.width), Math.round(b.y + b.height)]; };
let t = (await text()); out.top = t.replace(/[\w.+-]+@[\w.-]+/g, '<mail>').split('\n').filter(x => x.trim()).slice(0, 80).join(' ¦ ').slice(0, 3000);
await shot('3067-1-audit-top.png');
return out;

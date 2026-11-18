await page.goto(H + '/settings/security/audit-log', { waitUntil: 'domcontentloaded' }); await sleep(15000);
const t = (await page.locator('main').last().innerText()).replace(/\s+/g, ' ');
await shot('D2-1-audit-log.png');
const ips = [...t.matchAll(/(signed in|updated|deleted|added|published)[^]*?IP ([0-9a-f:.\/]+)/g)].slice(0, 12).map(m => m[1] + ' -> ' + m[2].replace(/^(\d+\.\d+)\.\d+\.\d+/, '$1.x.x'));
return { ips, signin: /signed in/.test(t) };

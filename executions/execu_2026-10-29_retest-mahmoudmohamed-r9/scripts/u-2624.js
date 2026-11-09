// NDC-2624 screen: QA lead e647a303 → Files tab → "+ Upload" two small text files (file chooser) → remove one. Records upload / delete calls (status only).
const L = 'e647a303-e5a7-46a0-b199-9ef1644ab3c0'; const calls = [];
page.on('response', r => { const u = r.url(); const m = r.request().method(); if (m !== 'GET' && !/auth|telemetry|presence|resolved-batch/.test(u) && /\/api\/|s3|blob/.test(u)) calls.push(m + ' ' + r.status() + ' ' + u.replace(/^https?:\/\/[^/]+/, '').replace(/\?.*$/, '').slice(0, 90)); });
const openFiles = async () => { await page.goto(`${H}/modules/${T.LEADS}/records/${L}`, { waitUntil: 'domcontentloaded', timeout: 150000 }); await page.waitForSelector('text=QA RT 2624 timeline lead', { timeout: 120000 }); await sleep(3000);
  await page.locator('text=/^Files$/').first().click(); await page.waitForSelector('text=ATTACHMENTS', { timeout: 30000 }); await sleep(2000); };
const upload = async (name, body) => { const ins = await page.$$('input[type=file]:not([accept^="image"])'); await ins[0].setInputFiles({ name, mimeType: 'text/plain', buffer: Buffer.from(body) }); await sleep(3000); await shot('2624-chooser-' + name + '.png');
  const go = await page.$('[role=dialog] button:has-text("Upload"), [role=dialog] button:has-text("Save"), [role=dialog] button:has-text("Attach")'); if (go) await go.click(); await sleep(9000); };
let out = {};
await openFiles(); await upload('qa-rt-2624-a.txt', 'QA RT 2624 attachment A'); await upload('qa-rt-2624-b.txt', 'QA RT 2624 attachment B');
await openFiles(); await shot('2624-2-uploaded.png'); let t = await text(); out.listed = ['qa-rt-2624-a.txt', 'qa-rt-2624-b.txt'].map(n => n + ':' + t.includes(n));
if (t.includes('qa-rt-2624-b.txt')) {
  const row = page.locator('tr', { hasText: 'qa-rt-2624-b.txt' }).first();
  const btns = await row.locator('button').all(); out.rowButtons = await Promise.all(btns.map(b => b.getAttribute('aria-label').then(a => a || b.innerText())));
  const del = row.locator('button[aria-label*="elete" i], button[aria-label*="emove" i], button:has-text("Delete")').first();
  if (await del.count()) await del.click(); else if (btns.length) { await btns[btns.length - 1].click(); await sleep(1000); await page.locator('[role=menuitem]', { hasText: /Delete|Remove/ }).first().click().catch(() => {}); }
  await sleep(1500); const c = await page.$('[role=dialog] button:has-text("Delete"), [role=alertdialog] button:has-text("Delete"), [role=alertdialog] button:has-text("Remove")'); if (c) await c.click();
  await sleep(6000); await openFiles(); await shot('2624-3-removed.png'); t = await text(); out.afterRemove = ['qa-rt-2624-a.txt', 'qa-rt-2624-b.txt'].map(n => n + ':' + t.includes(n));
}
out.calls = calls; return out;

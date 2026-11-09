const urls = await page.evaluate(() => performance.getEntriesByType('resource').map(e => e.name).filter(u => /\.js(\?|$)/.test(u)));
const out = {};
for (const u of urls) { const r = await page.context().request.get(u).catch(() => null); if (!r) continue; const t = await r.text();
  const a = t.indexOf('`customer_reply`,`'); if (a >= 0 && !out.events) out.events = t.slice(a - 40, a + 200);
  const b = t.indexOf('private_thread'); if (b >= 0 && !out.pt) out.pt = t.slice(b - 200, b + 300);
  for (const w of ['`AddComment`', '`SendEmailReply`', '`AddFollowers`', '`MarkAsSpam`', '`MarkSpam`', '`ShareTicket`', '`ChangeLayout`', '`AddSkills`', '`ReassignBySkills`', '`UpdateRelatedRecord`', '`RunCustomAction`', '`SlackNotification`', '`ExecutionTime`', '`CurrentTime`', '`NotBetween`'])
    { const j = t.indexOf(w); if (j >= 0 && !out[w]) out[w] = t.slice(Math.max(0, j - 150), j + 150); } }
return done(out);

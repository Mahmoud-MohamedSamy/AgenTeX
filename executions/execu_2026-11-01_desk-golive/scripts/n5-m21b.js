const o = {}; const t = (await txt()).replace(/\s+/g, ' '); const i = t.indexOf('Team Notifications');
const sec = t.slice(i, i + 4000); o.items = [...sec.matchAll(/(Assigning a ticket|Receiving a ticket reply|Adding a comment|Editing a comment|Mention[a-z ]*|[A-Z][a-z]+ing [a-z ]{3,30}) Notifies/g)].map(m => m[1]);
await page.setViewportSize({ width: 1600, height: 2000 }); await sleep(800);
const h = page.locator('text=/^Team Notifications$/').first(); await h.evaluate(e => e.scrollIntoView({ block: 'start' })).catch(() => {}); await sleep(1000);
o.shot = await shot('m21/tavi-team-notif-full'); await page.setViewportSize({ width: 1600, height: 900 });
return JSON.stringify(o);

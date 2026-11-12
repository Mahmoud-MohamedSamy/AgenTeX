const o = {};
await go('/views/all/tickets', 9000);
const bell = page.locator('button[aria-label*="otification"]').first(); await bell.click().catch(() => {}); await sleep(3500);
const tab = page.locator('button, [role=tab]', { hasText: /@Mentions/ }).first(); o.tab = await tab.count();
if (o.tab) { await tab.click().catch(() => {}); await sleep(3500); }
const panel = page.locator('[role=dialog], [data-radix-popper-content-wrapper]').last(); o.mentionsTab = ((await panel.innerText().catch(() => '')) || '').replace(/\s+/g, ' ').slice(0, 500); o.shot = await shot('../wave2n/r-b-mentions-tab');
const nl = await api('GET', '/notifications?limit=60'); o.types = [...new Set(arr(nl.j && nl.j.data).map(n => n.event_type))];
return done(o);

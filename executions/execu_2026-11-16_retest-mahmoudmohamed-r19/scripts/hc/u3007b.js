const RAW = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/'; const out = {};
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(H + '/views/all/tickets/4f632116-cc82-4644-b0c8-e7ea4727f88e', { waitUntil: 'domcontentloaded' });
await page.getByText('test00').first().waitFor({ timeout: 90000 }).catch(() => {}); await sleep(6000);
const sec = page.getByText('Community topic', { exact: false }).first(); out.sec = await sec.count();
if (out.sec) { await sec.scrollIntoViewIfNeeded(); await sleep(1500); const box = await sec.boundingBox(); out.box = box; out.secText = (await sec.locator('xpath=ancestor::*[3]').innerText()).replace(/\s+/g, ' ').slice(0, 400); await page.screenshot({ path: RAW + '3007-3-ticket-topic-card.png' }); }
// Reply menu: is there a Post reply to forum option?
await page.locator('button:has-text("Reply All") + button').first().click().catch(() => {}); await sleep(1500); out.replyMenu = (await page.getByRole('menu').first().innerText().catch(() => 'no menu')).replace(/\s+/g, ' ').slice(0, 300); await page.screenshot({ path: RAW + '3007-4-reply-menu.png' }); await page.keyboard.press('Escape');
// Desk community
await page.getByRole('link', { name: 'Knowledge Base' }).first().click(); await sleep(6000); out.kbUrl = page.url();
const cl = page.getByRole('link', { name: /Community/ }).first(); out.comm = await cl.count(); if (out.comm) { await cl.click(); await sleep(6000); out.commUrl = page.url(); }
const tp = page.getByText('test00', { exact: true }).first(); out.tp = await tp.count();
if (out.tp) { await tp.click(); await sleep(6000); out.topicUrl = page.url(); const x = (await text()).replace(/\s+/g, ' '); out.topicHits = (x.match(/.{0,80}(4671|Ticket).{0,80}/g) || []).slice(0, 5); await page.screenshot({ path: RAW + '3007-2-topic.png' }); }
return out;

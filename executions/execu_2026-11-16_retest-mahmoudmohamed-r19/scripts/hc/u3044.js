const RAW = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/'; const out = {};
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(H + '/views/all/tickets/c2700c91-3a4c-42ca-8076-5a1715ace30e', { waitUntil: 'domcontentloaded' });
await page.getByText('QA RT19 HC 3044 portal reply').first().waitFor({ timeout: 90000 }).catch(() => {}); await sleep(6000);
await page.screenshot({ path: RAW + '3044-1-thread-raw.png' });
const t = (await text()).replace(/\s+/g, ' '); out.thread = t.slice(t.indexOf('CONVERSATION'), t.indexOf('CONVERSATION') + 400);
const tab = page.getByText(/^History$/i).first(); out.tab = await tab.count();
if (!out.tab) { const more = page.locator('button:right-of(:text("APPROVAL"))').first(); await more.click().catch(() => {}); await sleep(1000); }
const tab2 = page.getByText(/^History$/i).first(); out.tab2 = await tab2.count(); if (out.tab2) { await tab2.click(); await page.getByText('Loading the history').waitFor({ state: 'detached', timeout: 60000 }).catch(() => {}); await sleep(3000); }
const t2 = (await text()).replace(/\s+/g, ' '); out.hist = (t2.match(/.{0,40}(received|Received).{0,120}/g) || []).slice(0, 5);
await page.screenshot({ path: RAW + '3044-2-history-raw.png' });
return out;

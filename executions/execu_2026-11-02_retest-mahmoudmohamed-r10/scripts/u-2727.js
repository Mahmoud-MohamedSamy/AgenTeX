// NDC-2727: lead with 12 deals → Deals section lists all 12 in a scrolling area; View all shows only this lead's deals.
const id = '53b72369-057a-4a3a-9a05-59f6f6276d6e'; const st = {};
await page.goto(H + '/modules/' + T.LEADS + '/records/' + id, { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 50; i++) { await sleep(3000); const t = await text(); if (t.includes('QA RT r10 2727 deal') && !/Loading\.\.\./.test(t)) break; } await sleep(5000);
const card = page.locator('text=/^DEALS \\(\\d+\\)$/i').first().locator('xpath=ancestor::*[.//*[contains(text(),"QA RT r10 2727 deal")]][1]');
await card.scrollIntoViewIfNeeded(); await sleep(2000);
st.header = (await page.locator('text=/^DEALS \\(\\d+\\)$/i').first().innerText()).trim();
const info = async () => card.evaluate(c => {
  const names = [...c.querySelectorAll('*')].filter(e => e.children.length === 0 && /QA RT r10 2727 deal \d+/.test(e.textContent)).map(e => e.textContent.trim().slice(-2));
  const sc = [...c.querySelectorAll('*')].filter(e => { const cs = getComputedStyle(e); return (cs.overflowY === 'auto' || cs.overflowY === 'scroll') && e.scrollHeight > e.clientHeight + 2; }).map(e => ({ h: e.clientHeight, sh: e.scrollHeight }));
  const more = [...c.querySelectorAll('button,a')].map(b => b.innerText.trim()).filter(Boolean);
  return { names, sc, more };
});
st.before = await info(); await card.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-02_retest-mahmoudmohamed-r10/screenshots/raw/2727-1-section.png' }).catch(() => {});
// scroll inside the section if possible
await card.evaluate(c => { for (const e of c.querySelectorAll('*')) { const cs = getComputedStyle(e); if ((cs.overflowY === 'auto' || cs.overflowY === 'scroll') && e.scrollHeight > e.clientHeight + 2) e.scrollTop = e.scrollHeight; } });
await sleep(3000); st.afterScroll = await info(); await card.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-02_retest-mahmoudmohamed-r10/screenshots/raw/2727-2-section-scrolled.png' }).catch(() => {});
const sm = card.getByText('Show more', { exact: true }); if (await sm.count()) { await sm.click(); await sleep(5000); st.afterShowMore = await info(); await card.evaluate(c => { for (const e of c.querySelectorAll('*')) { const cs = getComputedStyle(e); if ((cs.overflowY === 'auto' || cs.overflowY === 'scroll') && e.scrollHeight > e.clientHeight + 2) e.scrollTop = e.scrollHeight; } }); await sleep(1500); await card.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-02_retest-mahmoudmohamed-r10/screenshots/raw/2727-2b-after-show-more.png' }).catch(() => {}); }
const va = card.getByText('View all', { exact: true }); st.viewAll = await va.count();
if (st.viewAll && !process.env.SKIPVA) { await va.first().click(); for (let i = 0; i < 50; i++) { await sleep(3000); const t = await text(); if (/QA RT r10 2727 deal|No records|Total Records/.test(t) && !/Loading\.\.\./.test(t)) break; } await sleep(4000); st.viewAllUrl = decodeURIComponent(page.url()).replace(H, ''); await shot('2727-3-view-all.png'); const t = await text(); st.viewAllQA = (t.match(/QA RT r10 2727 deal \d+/g) || []).length; st.viewAllTotal = (t.match(/Total Records\s*(\d+)/) || [])[1]; st.otherDeals = /DealCreatedByConnectedRecord|AEX-01_CreatedDeal|QA RT r10 2726/.test(t); }
return st;

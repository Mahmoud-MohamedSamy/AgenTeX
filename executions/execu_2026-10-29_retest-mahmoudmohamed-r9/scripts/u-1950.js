// NDC-1950 screen (owner): My Requests — tabs + counts, columns per tab, filters, action controls, History rows. Read-only.
const out = {};
await page.goto(H + '/', { waitUntil: 'domcontentloaded', timeout: 150000 }); await page.waitForSelector('text=My Requests', { timeout: 120000 }); await sleep(2000);
await page.locator('text=/^My Requests$/').first().click(); await sleep(8000); out.url = page.url(); await shot('1950-1-page.png');
const tabs = await page.$$eval('[role=tab], [role=tablist] button', els => els.map(e => e.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean)); out.tabs = tabs;
const readTab = async (label, file) => {
  const tab = page.locator('[role=tab], [role=tablist] button', { hasText: label }).first(); if (!(await tab.count())) return 'no tab ' + label;
  await tab.click(); await sleep(5000); await shot(file);
  return page.evaluate(() => ({ headers: [...document.querySelectorAll('th, [role=columnheader]')].map(h => h.innerText.trim()).filter(Boolean),
    rows: [...document.querySelectorAll('tbody tr, [role=row]')].map(r => r.innerText.replace(/\s+/g, ' ').trim()).filter(t => /QA RT 1950/.test(t)).slice(0, 6),
    filters: [...document.querySelectorAll('button, select, input')].map(e => (e.getAttribute('aria-label') || e.placeholder || e.innerText || '').trim()).filter(t => /module|process|type|status|date|submitted|decided|attempt|sla|search|export|csv/i.test(t)).slice(0, 25),
    actions: [...document.querySelectorAll('button')].map(b => b.innerText.trim()).filter(t => /^(Approve|Reject|Delegate|Review|Respond|Recall)$/i.test(t)),
    empty: (document.body.innerText.match(/No (records|history)[^\n]{0,60}/) || [''])[0] }));
};
out.pendingApproval = await readTab(/Pending Approval/i, '1950-2-pending-approval.png');
out.pendingReview = await readTab(/Pending Review/i, '1950-3-pending-review.png');
out.history = await readTab(/History/i, '1950-4-history.png');
return out;

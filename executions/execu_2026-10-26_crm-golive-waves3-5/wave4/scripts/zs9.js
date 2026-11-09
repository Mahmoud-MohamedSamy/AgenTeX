await page.goto('https://crm.zoho.com/crm/org943261092/tab/Leads/custom-view/7654005000000087501/list', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(15000);
const href = await page.evaluate(() => { const a = [...document.querySelectorAll('a[href*="/tab/Leads/"]')].find(x => /\/tab\/Leads\/\d{10,}/.test(x.getAttribute('href'))); return a && a.getAttribute('href'); });
if (!href) return 'no lead link';
await page.goto('https://crm.zoho.com' + href, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(15000);
const em = page.getByText('Emails', { exact: true }).filter({ visible: true });
if (await em.count()) { await em.first().click().catch(() => {}); await page.waitForTimeout(5000); }
await page.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-26_crm-golive-waves3-5/wave4/evidence/raw/z-lead-emails.png' });
const t = (await page.innerText('body')).replace(/\s+/g, ' '); const i = t.indexOf('Emails');
return { href, emailsSection: t.slice(i, i + 700) };

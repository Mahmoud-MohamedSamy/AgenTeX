await page.goto('https://crm.zoho.com/crm/org943261092/settings/email-configuration', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(12000);
const tabs = await page.evaluate(() => [...document.querySelectorAll('a,li,span,div')].filter(e => /^(Email Configuration|Compose Settings|Email Sharing)$/.test((e.innerText || '').trim()) && e.offsetParent).map(e => e.tagName + ' ' + (e.getAttribute('href') || '') + ' ' + (e.id || '') + ' ' + String(e.className).slice(0, 40)));
const el = page.locator('a,li,span').filter({ hasText: /^Email Configuration$/ }).filter({ visible: true });
const n = await el.count(); if (n) await el.last().click({ force: true }).catch(() => {});
await page.waitForTimeout(8000);
await page.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-26_crm-golive-waves3-5/wave4/evidence/raw/z-email-providers.png' });
const t = (await page.innerText('body')).replace(/\s+/g, ' ');
return { tabs, n, url: page.url(), text: t.slice(t.indexOf('Compose Settings Help'), t.indexOf('Compose Settings Help') + 900) };

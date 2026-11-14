await go('/hq', 8000);
await page.getByRole('button', { name: /^EN$/ }).first().click(); await sleep(1500);
await page.getByRole('menuitemradio', { name: /العربية|Arabic/ }).first().click().catch(async () => await page.getByText(/العربية|Arabic/).first().click()); await sleep(5000);
out.dir = await page.evaluate(() => document.documentElement.dir + ' ' + document.documentElement.lang);
const pages = { plans: '/settings/automation/support-plans?department=' + MK, actions: '/settings/developer/custom-actions', aitag: '/settings/automation/ai-tagging', archiving: '/settings/tickets/archiving', contract: '/modules/' + KM + '/records/c5a8482a-0bce-4fb0-94b5-ee7b939e72ac', ticket: '/views/all/tickets/3ecf52a9-f3cd-41c6-a60f-931582cac7cd' };
for (const [k, u] of Object.entries(pages)) { await go(u, 10000); let t = (await page.locator('#main-content').innerText().catch(() => '')).replace(/\s+/g, ' ');
  const i = t.lastIndexOf('Email Providers'); const j = Math.max(i, t.lastIndexOf('موفرو البريد'), t.lastIndexOf('مزودو البريد')); if (j > 0) t = t.slice(j);
  const words = (t.match(/\b[A-Za-z][a-z]{3,}(?: [A-Za-z][a-z]{2,})*\b/g) || []).filter(w => !/QA|GL|W3|Desk|CRM|ndc|staging|owner|example|NDC|Wonder|Travel|SalesIQ|Book|hold|pay|wallet|Confirm|price|Look|booking|offers|agency|profile|login|Portal|sign|search|flights|Release|Void|tickets|Offer|details|Pay|this|Search|More|page|sort|filter|webhook|echo|chatbot|bookings|auth|Allowance|Unlimited|Contract|Account|Marketing|plan|ticket|entitlement|check|keyword|still|give|request|form|balance|multi|city|look|Channel|Chatbot|secure|secured|https|lemonstone|azurecontainerapps|northeurope|staging|Calendar/i.test(w));
  out[k] = { dir: await page.evaluate(() => document.documentElement.dir), english: [...new Set(words)].slice(0, 20), keys: (t.match(/\b[a-z]+(\.[a-zA-Z_]+){2,}\b/g) || []).slice(0, 6) }; await shot('w3/W3-36-ar-' + k); }
// back to English
await go('/hq', 8000); const lb = page.getByRole('button', { name: /^(AR|ع|العربية)$/ }).first(); if (await lb.count()) { await lb.click(); await sleep(1200); await page.getByRole('menuitemradio', { name: /English/ }).first().click().catch(async () => await page.getByText('English').first().click()); await sleep(4000); }
out.dirAfter = await page.evaluate(() => document.documentElement.dir + ' ' + document.documentElement.lang);
return fin({ out });

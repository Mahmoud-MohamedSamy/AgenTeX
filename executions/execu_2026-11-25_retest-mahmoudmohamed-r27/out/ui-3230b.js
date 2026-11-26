const o = {};
await page.goto(H + '/settings/automation/workflow-rules/8c218015-630e-4f71-bc81-d902029863db', { waitUntil: 'commit' }); await page.getByText('QA RT27 3230').first().waitFor({ timeout: 120000 }); await sleep(4000);
const sec = page.getByText('Which Tickets would you like to apply this rule to?').first().locator('xpath=ancestor::*[.//button][2]');
o.secButtons = await sec.locator('button, [role=radio], input').evaluateAll(es => es.map(e => ({ tag: e.tagName, type: e.type, aria: e.getAttribute('aria-label'), title: e.getAttribute('title'), text: (e.innerText || e.value || '').trim().slice(0, 40) })));
o.save = await page.getByRole('button', { name: /^(Save|Save changes|Update|Save rule)$/i }).evaluateAll(es => es.map(e => e.innerText.trim()));
return o;

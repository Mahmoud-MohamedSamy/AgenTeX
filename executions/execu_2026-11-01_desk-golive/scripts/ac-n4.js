await go('/settings/customization/notifications', 10000);
const head = (await mtxt()).match(/Department (Customer Support|[A-Za-z ]+?) Rules are set/)?.[1]; out.dept = head;
const row = page.locator('div,li,tr', { hasText: /^Receiving a shared ticket/ }).last();
const lab = page.getByText('Receiving a shared ticket', { exact: true }).first(); await lab.scrollIntoViewIfNeeded(); await sleep(800);
const box = lab.locator('xpath=ancestor::*[.//*[@role="switch"] or .//input[@type="checkbox"]][1]');
out.switches = await box.locator('[role=switch], input[type=checkbox]').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.name || '') + '=' + (e.getAttribute('aria-checked') ?? e.checked)));
out.rowTxt = (await box.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300);
await shot('access/o-notif-shared-row');
return fin({ out });

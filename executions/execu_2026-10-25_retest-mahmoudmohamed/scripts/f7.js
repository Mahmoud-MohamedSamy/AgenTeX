const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', F = '4d61be96-a89a-4567-adaa-8666ad25dbbe';
const d = page.locator('[role=alertdialog], [role=dialog]').first();
const btns = await d.locator('button, [role=radio], input[type=radio]').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.innerText || e.value || e.tagName).trim().slice(0, 40) + (e.disabled || e.getAttribute('aria-disabled') === 'true' ? ' [disabled]' : '')));
const full = (await d.innerText()).slice(0, 900);
await shot('2106-03-delete-dialog');
await d.getByRole('button', { name: /Cancel/i }).first().click().catch(() => page.keyboard.press('Escape')); await sleep(800);
const api1 = await api('DELETE', `/modules/${L}/fields/${F}`);
return done({ btns, full, apiDelete: api1.s + ' ' + api1.t.slice(0, 400) });

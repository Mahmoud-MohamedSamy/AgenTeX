const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const V = '8dceae79-4e80-459c-801b-5291dd0714f0'; const out = {};
await sleep(8000);
out.editor = (await page.locator('main').last().innerText()).replace(/\s+/g, ' ').slice(0, 700);
out.inputs = []; for (const e of await page.locator('main input, main button[aria-label]').all()) { const l = (await e.getAttribute('aria-label')) || ''; const v = await e.inputValue().catch(() => ''); if (/company|value|criteria|field|operator/i.test(l) || v) out.inputs.push(l + '=' + v); }
out.hasTest = /\btest\b/.test(out.editor.replace('QA RT k7', ''));
await shot('NDC-2097-user1-editor');
await go('/modules/' + L + '?view=' + V, 14000); await shot('NDC-2097-user1-grid');
out.grid = (await page.locator('main').last().innerText()).replace(/\s+/g, ' ').slice(0, 300);
return done(out);

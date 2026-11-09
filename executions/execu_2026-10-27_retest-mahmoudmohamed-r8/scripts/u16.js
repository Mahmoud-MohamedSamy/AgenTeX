// NDC-1678: Edit Teamspace page of QA RT TS r6 — icon, admin picker, description.
page.on('dialog', d => d.accept().catch(() => {}));
await go('/settings/teamspace', 12000);
await page.getByText('QA RT TS r6', { exact: true }).first().click({ force: true }); await sleep(5000); await shot('1678-01-edit');
const t = (await txt()).split('\n').filter(l => l.trim());
const descVal = await page.locator('textarea:visible').first().inputValue().catch(() => null);
const btns = await page.locator('button:visible').evaluateAll(b => b.map(x => (x.innerText || x.getAttribute('aria-label') || '').trim()).filter(x => /icon|logo|image|upload|admin|color|emoji/i.test(x)));
const adminCtl = await page.evaluate(() => { const l = [...document.querySelectorAll('label, span, div')].find(e => e.childElementCount === 0 && /^Admin$/i.test(e.textContent.trim())); if (!l) return null; const box = l.parentElement; const c = box.querySelector('button, select, [role=combobox], input'); return c ? { tag: c.tagName, disabled: c.disabled || c.getAttribute('aria-disabled'), text: (c.innerText || c.value || '').slice(0, 40) } : 'no control'; });
return done({ descVal, btns, adminCtl, lines: t.filter(l => /icon|logo|admin|description|Permissions|Accessible/i.test(l)).slice(0, 12) });

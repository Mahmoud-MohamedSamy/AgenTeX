await go('/modules/' + KM + '/records/new', 10000);
out.ctrls = await page.locator('main').locator('input,textarea,button,[role=combobox]').evaluateAll(es => es.filter(e => e.offsetParent).map(e => { const lab = e.closest('div')?.parentElement?.querySelector('label')?.innerText || ''; return [e.tagName, e.type, e.name || '', e.placeholder || '', e.getAttribute('aria-label') || '', (e.innerText || '').trim().slice(0, 30), lab.slice(0, 30)].join('|'); })).catch(e => String(e));
return fin({ out });

await go('/settings/automation/blueprints/new'); await sleep(8000);
log(await page.locator('input,textarea,button[role=combobox],[role=combobox]').evaluateAll(a => a.filter(x => x.offsetParent).map(x => x.tagName + '|' + x.id + '|' + (x.getAttribute('aria-label')||'') + '|' + (x.placeholder||'') + '|' + (x.getAttribute('role')||'') + '|' + (x.innerText||'').slice(0,30))));

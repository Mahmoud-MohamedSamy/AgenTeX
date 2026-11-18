await go('/settings/users-control/agents', 7000); await page.getByText('Export', { exact: true }).first().click(); await sleep(6000);
out.url = page.url(); const t = await mtxt(); const i = t.indexOf('Email Providers'); out.t = (i > 0 ? t.slice(i + 15) : t).slice(0, 1200); await shot('access/b-export-page');
out.btns = await page.locator('main').last().locator('button,select,[role=combobox]').evaluateAll(es => es.map(e => ((e.getAttribute('aria-label') || '') + '|' + (e.innerText || '')).slice(0, 50)).slice(0, 30));
return fin({ out });

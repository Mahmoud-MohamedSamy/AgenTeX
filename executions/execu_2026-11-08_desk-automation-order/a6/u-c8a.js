await go('/settings/automation/blueprints/new'); await sleep(8000);
log('url', page.url().replace(H,''));
log('main', (await page.locator('body').innerText()).split('Email Providers').pop().replace(/\s+/g,' ').slice(0,1500));
log('buttons', await page.getByRole('button').evaluateAll(a => a.filter(x=>x.offsetParent).map(x => (x.innerText||x.getAttribute('aria-label')||'').trim().slice(0,30)).filter(Boolean)));
log('draggables', await page.locator('[draggable=true]').evaluateAll(a => a.map(x => x.innerText.trim().slice(0,30))));
await shot('c8-new-designer');

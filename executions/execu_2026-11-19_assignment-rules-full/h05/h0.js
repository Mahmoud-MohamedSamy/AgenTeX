await page.goto(H + '/settings/customization/skills', { waitUntil: 'commit' }); await sleep(25000); log('url', page.url()); log('t', (await text()).replace(/\s+/g, ' ').slice(0, 200));

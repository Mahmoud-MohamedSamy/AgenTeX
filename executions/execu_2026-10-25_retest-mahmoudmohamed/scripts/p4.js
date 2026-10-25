await shot('2122-02b-state');
const pats = await page.locator('#main-content input, #main-content textarea').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.placeholder || e.name || '?') + ' = ' + JSON.stringify(e.value)));
return done({ pats, crit: ((await txt()).split('Specify criteria')[1] || '').split('Related modules')[0].slice(0, 600) });

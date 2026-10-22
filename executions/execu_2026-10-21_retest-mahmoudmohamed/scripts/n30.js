await sleep(20000);
const t = await txt();
const unused = t.match(/Unused Fields\n(\d+)/)?.[1];
const canvasHas = await page.locator('main').locator('text=QA RT rollup').evaluateAll(es => es.map(e => { let p = e; while (p && !/sidebar|aside|unused/i.test((p.className || '') + (p.tagName === 'ASIDE' ? 'aside' : ''))) p = p.parentElement; return p ? 'sidebar' : 'canvas'; }));
await shot('1444-13-after-reload');
return done({ head: t.match(/Leads\n\|\n[^\n]*/)?.[0], unused, canvasHas });

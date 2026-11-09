const o = {};
const t = (await txt()).replace(/\s+/g, ' '); const i = t.indexOf('Instant actions'); o.tail = t.slice(i, i + 1500);
const a = page.locator('text=/^Instant actions$/').first(); if (await a.count()) await a.scrollIntoViewIfNeeded(); await sleep(800); o.shot = await shot('m20/tavi-rule-actions'); return JSON.stringify(o);

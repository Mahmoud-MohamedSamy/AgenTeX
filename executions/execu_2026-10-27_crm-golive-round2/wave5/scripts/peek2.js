await shot('peek');
const d = await page.locator('[role=dialog]').count();
const ctrls = d ? await page.$$eval('[role=dialog] button, [role=dialog] select, [role=dialog] input', es => es.map(e => e.tagName + '|' + (e.getAttribute('aria-label') || '') + '|' + (e.innerText || e.value || '').trim().slice(0, 40) + (e.tagName === 'SELECT' ? '|' + [...e.options].map(o => o.text).join('/').slice(0, 200) : ''))) : [];
return { d, text: d ? (await page.locator('[role=dialog]').first().innerText()).replace(/\s+/g, ' ').slice(0, 800) : '', ctrls };

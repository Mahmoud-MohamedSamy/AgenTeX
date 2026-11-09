await go('/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new', 10000);
await page.locator('select').first().selectOption('1b55c25d-eb27-4046-afd1-b292398b435b').catch(() => {}); await sleep(8000); await shot('d1-form-2-standard');
const inputs = await page.evaluate(() => [...document.querySelectorAll('input,textarea,[role=combobox],[contenteditable=true]')].filter(e => e.offsetParent).map(e => { const r = e.getBoundingClientRect(); return { tag: e.tagName, type: e.type, name: e.getAttribute('name'), ph: e.getAttribute('placeholder'), aria: e.getAttribute('aria-label'), val: e.value, y: Math.round(r.y) }; }).slice(0, 40));
const labels = (await txt()).split('\n').filter(l => l.trim()).slice(25, 110);
return done({ inputs, labels });

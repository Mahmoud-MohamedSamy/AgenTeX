await go('/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new', 10000); await shot('d1-form-1-new');
const inputs = await page.evaluate(() => [...document.querySelectorAll('input,textarea,[role=combobox]')].filter(e => e.offsetParent).map(e => ({ tag: e.tagName, name: e.getAttribute('name'), ph: e.getAttribute('placeholder'), aria: e.getAttribute('aria-label'), id: e.id })).slice(0, 40));
const labels = (await txt()).split('\n').filter(l => l.trim()).slice(0, 80);
return done({ inputs, labels });

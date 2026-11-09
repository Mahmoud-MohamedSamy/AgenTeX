const o = {};
o.selects = await page.$$eval('select, [role=combobox]', ss => ss.filter(s => s.offsetParent).map(s => (s.tagName === 'SELECT' ? [...s.options].map(x => x.text).slice(0, 6).join('/') : s.innerText.trim()).slice(0, 80)));
o.deptWords = ((await txt()).match(/.{0,60}(department|Department|per layout|layout)[^.]{0,80}/g) || []).slice(0, 8);
return JSON.stringify(o);

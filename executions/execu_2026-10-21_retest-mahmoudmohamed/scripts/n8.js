const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const fl = arr((await api('GET', `/modules/${L}/fields`)).j.data).filter(f => /formula|rollup/.test(f.datatypeKey)).map(f => f.fieldName + ' ' + f.labels?.en + ' ' + f.datatypeKey + ' @' + (f.layouts || []).map(x => x.layoutName).join(','));
const onPage = await page.locator('main').getByText(/Formula/).allInnerTexts();
return done({ fl, onPage: onPage.slice(0, 10) });

const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const fl = arr((await api('GET', `/modules/${L}/fields`)).j.data).filter(f => /rollup/.test(f.datatypeKey)).map(f => ({ id: f.id, name: f.fieldName, label: f.labels?.en, cfg: JSON.stringify(f.config || f.datatypeOptions).slice(0, 400), lays: (f.layouts || []).map(x => x.layoutName) }));
return done({ fl, toasts: await page.locator('[data-sonner-toast]').allInnerTexts(), url: page.url() });

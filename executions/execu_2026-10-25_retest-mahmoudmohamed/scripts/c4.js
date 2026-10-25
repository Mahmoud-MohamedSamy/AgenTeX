const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', LT = '6261fa51-b6e7-4c73-a83d-f6ecbd6260d1';
const lay = (await api('GET', `/modules/${L}/layouts/${LT}`)).t;
const me = await api('GET', '/iam/me').catch(() => ({}));
return done({ layoutRefs: (lay.match(/qa_rt_[a-z_]+/g) || []), html: await page.evaluate(() => document.documentElement.lang + '/' + document.documentElement.dir) });

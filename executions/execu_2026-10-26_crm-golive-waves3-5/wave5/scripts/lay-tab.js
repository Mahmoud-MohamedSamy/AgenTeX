const d = (await call('GET', '/modules/bb375218-6a5d-48ec-a832-fb062fd0311b/layouts/f0bf4593-f455-4cee-8230-2e7c1b3d09d9')).j.data;
const s = JSON.stringify(d.views); const m = s.match(/"(tab_?[oO]rder|tabOrder)":"?[a-z_]+"?/g); return { tabOrder: m, rowVersion: d.rowVersion };

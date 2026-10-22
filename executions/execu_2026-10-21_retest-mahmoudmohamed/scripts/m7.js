const P = 'e51b6c77-bbf2-4a71-876c-78b99ec8d128';
const fl = arr((await api('GET', `/modules/${P}/fields`)).j.data).map(f => f.fieldName + ':' + f.datatypeKey + (f.isSystemManaged ? ' [sysmanaged]' : '') + ((f.layouts || []).length ? '' : ' [no layout]'));
await go('/settings/modules-and-fields/841043e1-c078-41f9-8d6e-dfd61bee45c3', 9000);
await page.getByText('Lead Conversion Mapping', { exact: true }).first().click(); await sleep(5000);
const t = (await txt()).split('Lead Conversion Mapping')[1]?.split('Settings')[0]?.slice(0, 2500);
await shot('1229-03-conversion-tab');
return done({ fl, t });

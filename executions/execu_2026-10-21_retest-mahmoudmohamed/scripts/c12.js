const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const now = {}; for (const id of ['8e8227b2-a494-47e3-a368-4e2880e49c39', '2f41b135-71ad-42ad-be80-1674a0d50169']) { const d = (await api('GET', `/modules/${D}/records/${id}`)).j.data; now[id] = { mod: d.last_modified_at, ...Object.fromEntries(d.data.filter(x => /pipeline|stage/.test(x.field)).map(x => [x.field, x.value.value])) }; }
return done({ now, shot: await shot('1316-08-after-update'), dlg: await page.locator('[role=dialog]').allInnerTexts() });

const T = (await mods()).find(m => /qa_mf_types$/.test(m.moduleKey));
await go(`/modules/${T.id}`, 12000); const b = (await page.locator('button:visible').allInnerTexts()).map(x => x.trim()).filter(Boolean);
const s = await shot('w3-types-list');
rec('W3', 'INFO', `singular ${T.singularForm}; url ${page.url().replace(H, '')}; buttons [${b.join(' | ').slice(0, 300)}]; text ${(await txt()).replace(/\s+/g, ' ').slice(0, 200)}`, { shot: s });
return done();

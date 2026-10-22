const d = page.locator('[role=dialog]').last();
const inputs = await d.locator('input,select,textarea').evaluateAll(es => es.map(e => e.tagName + ' ' + e.type + ' ' + (e.placeholder||'') + ' ' + (e.value||'')));
return done({ txt: await d.innerText(), inputs });

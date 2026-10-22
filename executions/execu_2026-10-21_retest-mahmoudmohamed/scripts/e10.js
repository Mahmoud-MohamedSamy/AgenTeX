const all = await page.locator('[role=dialog]').allInnerTexts();
const pops = await page.locator('input[placeholder*="earch"]').evaluateAll(es => es.map(e => e.placeholder));
return done({ all: all.map(x => x.slice(0, 800)), pops, shot: await shot('1325-02') });

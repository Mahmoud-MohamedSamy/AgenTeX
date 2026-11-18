await page.goto(H+'/settings/customization/skills',{waitUntil:'domcontentloaded'});await sleep(10000);
const t=await text();log('hits '+JSON.stringify([...new Set((t.match(/[^\n]*(agent|round robin|assign)[^\n]*/gi)||[]).map(s=>s.trim().slice(0,300)))].slice(0,15)));
const f=page.getByText(/at least one|any of|every active skill|every skill/i).first();log('found '+await f.count());if(await f.count()){await f.scrollIntoViewIfNeeded();await sleep(500);log('box '+JSON.stringify(await f.boundingBox())+' text '+(await f.innerText()).slice(0,400));}
await shot('2931-1-setup-skills-help.png');

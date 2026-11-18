// 2931: help text about skill-based round robin on Setup (Assignment Rules › Skills / Round Robin new rule help)
await page.goto(H+'/settings/automation/assignment-rules',{waitUntil:'domcontentloaded'});await sleep(9000);
const tabs=await page.getByRole('tab').allInnerTexts();log('tabs '+JSON.stringify(tabs));
const sk=page.getByRole('tab',{name:/Skills/i}).first();if(await sk.count()){await sk.click();await sleep(5000);}
let t=(await text()).replace(/\s+/g,' ');const m=t.match(/[^.]{0,200}(every|any|at least one)[^.]{0,40}skill[^.]{0,200}\./gi);log('sentences '+JSON.stringify(m));
const f=page.getByText(/at least one|any of|every active skill/i).first();if(await f.count()){await f.scrollIntoViewIfNeeded();const bb=await f.boundingBox();log('box '+JSON.stringify(bb));}
await shot('2931-1-setup-skills-help.png');
log('url '+page.url());

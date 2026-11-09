// 8 Nov: TAVI Skills / Skill Types screenshots for the per-department skill types bug (read only)
eval(require('fs').readFileSync('lib.js','utf8'));
const o={};const S='../screenshots/';await page.setViewportSize({width:1600,height:1000});
const txt=async()=> (await page.innerText('body').catch(()=>'')).replace(/\s+/g,' ');
const go=async(u,re)=>{await page.goto(H+u,{waitUntil:'commit',timeout:180000});for(let i=0;i<60;i++){await page.waitForTimeout(3000);if(re.test(await txt()))break;}await page.waitForTimeout(2000);};
await go('/settings/customization/skills',/Skill Types/);o.skillsTab=(await txt()).match(/Skills Define.{0,600}/)?.[0];await page.screenshot({path:S+'ev-ST-tavi-skills-tab.png'});
await go('/settings/customization/skills?tab=skill-types',/Every department uses the same types/);o.typesTab=(await txt()).match(/Skills Define.{0,500}/)?.[0];await page.screenshot({path:S+'ev-ST-tavi-skill-types-tab.png'});
const box=async re=>{const l=page.getByText(re).first();return (await l.count())?await l.boundingBox():null;};
o.bHint=await box(/Every department uses the same types/);o.bTab=await box(/^Skill Types$/);
const st=(await api('GET','/desk/skill-types')).j.data;o.types=JSON.stringify(st).slice(0,600);
const sk=(await api('GET','/desk/skills?department_id='+IDS.DA)).j.data;o.skillsDA=JSON.stringify(sk).slice(0,500);
return o;

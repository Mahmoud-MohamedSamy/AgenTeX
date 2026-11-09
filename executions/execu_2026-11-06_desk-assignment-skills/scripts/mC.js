const o={};const S='../screenshots/';await page.setViewportSize({width:1600,height:1000});
const txt=async()=> (await page.innerText('body').catch(()=>'')).replace(/\s+/g,' ');
const go=async(u,re)=>{await page.goto(H+u,{waitUntil:'commit',timeout:180000});for(let i=0;i<60;i++){await page.waitForTimeout(3000);const t=await txt();if(re.test(t))return t;}return await txt();};
o.importText=(await go('/settings/data/import?module=88e8ea44-1658-4df3-9930-d0902b91073d',/import/i)).slice(0,2500);await page.screenshot({path:S+'ev-D14-import-start.png'});
o.wfText=(await go('/settings/channels/web-forms',/web form/i)).slice(0,1500);await page.screenshot({path:S+'ev-D14-webforms-list.png'});
o.wfEd=(await go('/settings/channels/web-forms/dfff0af0-a0aa-45b2-8b46-3b3aaa187a3c',/test/)).slice(0,2500);
return o;

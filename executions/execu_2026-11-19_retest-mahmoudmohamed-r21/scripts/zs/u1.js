const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/screenshots/raw/';
module.exports=async(page,z)=>{await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/setup',{waitUntil:'commit'});await page.waitForTimeout(15000);
const t=(await page.innerText('body')).replace(/[\w.+-]+@[\w.-]+/g,'<email>');await page.screenshot({path:R+'zs-tmp.png'});
const links=await page.evaluate(()=>[...document.querySelectorAll('a[href]')].map(a=>a.innerText.trim().slice(0,40)+' => '+a.getAttribute('href')).filter(x=>/setup/.test(x)));return page.url()+'\n'+t.slice(0,2500)+'\n'+links.join('\n');};

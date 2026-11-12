async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/desk-perm/'; require('fs').mkdirSync(EV,{recursive:true});
 const out={}; await page.goto('https://staging-desk.taviportal.com/settings',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000);
 const nav=(await page.innerText('body')).replace(/\s+/g,' '); out.settingsMenu=nav.slice(0,1500); await page.screenshot({path:EV+'d0-settings.png'});
 for(const [n,u] of [['perm','/settings/security/permissions'],['prof','/settings/security/profiles'],['ucprof','/settings/users-control/profiles'],['roles','/settings/users-control/roles']]){
  await page.goto('https://staging-desk.taviportal.com'+u,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(6000);
  const t=(await page.innerText('body')).replace(/\s+/g,' '); out[n]={url:page.url(), text:t.slice(Math.max(0,t.length-700))}; await page.screenshot({path:EV+'d-'+n+'.png'}); }
 return out; }

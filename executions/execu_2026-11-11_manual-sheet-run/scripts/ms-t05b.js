const L=require('./lib');
module.exports=async()=>{const R={};const id=JSON.parse(require('fs').readFileSync(OUT+'/ms-t05a.json')).id;R.id=id;await L.gotoTicket(id);
 const tabs=pg.locator('[role=tab]').filter({hasText:/conversation|resolution|time entry|attachment|parent-child|activity|approval|history/i});const n=await tabs.count();R.tabRes={};
 for(let i=0;i<n;i++){const tb=tabs.nth(i);const name=(await tb.innerText()).trim().replace(/\s+/g,' ');await tb.click().catch(()=>{});await pg.waitForTimeout(4000);
  const ctl=await tb.getAttribute('aria-controls');const panel=await pg.evaluate(c=>{const p=c&&document.getElementById(c);return p?p.innerText.replace(/\s+/g,' '):'(no panel '+c+')';},ctl);
  const bad=(panel.match(/(unexpected error|something went wrong|failed to load|\b[a-z]+\.[a-z_]+\.[a-z_]+\b|\bundefined\b|\[object Object\]|"[a-z_]+":)/gi)||[]);
  R.tabRes[name]={panel:panel.slice(0,350),bad};await L.shot('t05-01-tab-'+name.replace(/[^A-Z]/g,''));}
 return R;};

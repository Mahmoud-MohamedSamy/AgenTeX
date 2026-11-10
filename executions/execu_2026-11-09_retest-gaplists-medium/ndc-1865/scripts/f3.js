// Revisit each page by URL and record the GET /api/v1 calls it makes (status + item count). Skips /iam/auth.
const pages = JSON.parse(require('fs').readFileSync(require('path').resolve('pages.json'),'utf8'));
const out={};
for (const [label,url] of pages){
  const calls=[];
  const h = async r => { try{ const u=r.url(); if(!u.includes('/api/v1/')||/\/iam\/auth/.test(u)||r.request().method()!=='GET')return;
     let n=null; try{const j=await r.json(); const a=Array.isArray(j)?j:(j&&(j.items||j.data||j.results||j.records)); n=Array.isArray(a)?a.length:(j&&j.total!=null?'total '+j.total:null); if(j&&j.total!=null&&Array.isArray(a)) n=a.length+' (total '+j.total+')';}catch(e){}
     calls.push(r.status()+' '+u.split('/api/v1')[1].split('?')[0]+(n!=null?' ['+n+']':'')); }catch(e){} };
  page.on('response',h);
  await page.goto(H+url,{waitUntil:'commit',timeout:120000}); await sleep(14000);
  page.off('response',h);
  out[label]=[...new Set(calls)].filter(c=>!/\/(me|notifications|i18n|translations|feature-flags|app-config)/.test(c)).slice(0,12);
}
return out;

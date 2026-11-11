const L=require('./lib');module.exports=async()=>{const R={};const vid='aa86e48f-0c26-419c-ad79-62910f7b8aba';const v=(await api('GET','/modules/'+T+'/views/'+vid)).j.data;
 R.rowsNow=(await api('GET','/modules/'+T+'/records?page=1&per_page=50&view_id='+vid)).t.slice(0,120);
 const s={...v.settings,criteria:{pattern:null,conditions:[{field:'subject',value:'QA MAN',operator:'contains'},{field:'department',value:[L.D.MK],operator:'contains_any_of'}]}};
 for(const m of ['PATCH','PUT']){const r=await api(m,'/modules/'+T+'/views/'+vid,{name:v.name,visibility:v.visibility,settings:s,row_version:v.row_version});R[m]=r.s+' '+r.t.slice(0,150);if(r.s<300)break;}
 await pg.setViewportSize({width:1600,height:1000});await pg.goto(H+'/views/custom:'+vid,{waitUntil:'commit'}).catch(()=>{});await pg.waitForFunction(()=>/QA MAN view \(\d+\)/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await pg.waitForTimeout(4000);
 R.head=(await L.body_txt()).match(/QA MAN view \(\d+\)/)?.[0];R.rows=await pg.evaluate(()=>[...document.querySelectorAll('main [aria-label^="Select "]')].map(e=>e.getAttribute('aria-label').replace('Select ','')).filter(x=>x!=='all'));await L.shot('t01-02-view-id');
 // restore UI-made criteria text (to keep evidence consistent) not needed
 return R;};

// T-05 prep + explore: ticket "QA MAN phone 01" in Marketing; dump header buttons, tabs, property controls; T-05-01 click each tab.
const L=require('./lib');
module.exports=async()=>{const R={};
 let t=(await L.findTicket('QA MAN phone 01'))[0];
 if(!t){const c=await api('POST','/modules/'+T+'/records',L.body({subject:'QA MAN phone 01',department:L.D.MK,status:'Open',channel:'phone',contact_id:'bc1b1c62-c31a-40ec-a089-cfcdcc6864b1',description:'Caller asks about refund'}));R.create=c.s;const id=c.j&&c.j.data&&c.j.data.id;if(id){LED('T-05 ticket "QA MAN phone 01" '+id);t={id};}}
 R.id=t.id;await L.gotoTicket(t.id);
 R.headerBtns=await pg.evaluate(()=>[...document.querySelectorAll('main button')].slice(0,40).map(b=>(b.getAttribute('aria-label')||b.innerText||'').trim().replace(/\s+/g,' ').slice(0,30)).filter(Boolean));
 R.tabs=await pg.evaluate(()=>[...document.querySelectorAll('[role=tab]')].map(b=>b.innerText.trim().replace(/\s+/g,' ')));
 R.props=await pg.evaluate(()=>[...document.querySelectorAll('[data-rule-field],[data-field-key],[data-field]')].map(e=>(e.getAttribute('data-rule-field')||e.getAttribute('data-field-key')||e.getAttribute('data-field'))+': '+e.innerText.replace(/\s+/g,' ').slice(0,50)).slice(0,40));
 await L.shot('t05-01-detail');
 R.tabRes={};const tabs=pg.locator('[role=tab]');const n=await tabs.count();
 for(let i=0;i<n;i++){const tb=tabs.nth(i);const name=(await tb.innerText()).trim().replace(/\s+/g,' ');await tb.click().catch(()=>{});await pg.waitForTimeout(3500);
  const panel=await pg.evaluate(()=>{const p=document.querySelector('[role=tabpanel]:not([hidden])');return p?p.innerText.replace(/\s+/g,' ').slice(0,300):'(no panel)';});
  const bad=(panel.match(/(unexpected error|something went wrong|failed to load|\b[a-z]+\.[a-z_]+\.[a-z_]+\b|\bundefined\b|\bnull\b|\[object Object\])/gi)||[]);
  R.tabRes[name]={panel:panel.slice(0,160),bad};await L.shot('t05-01-tab-'+i);}
 return R;};

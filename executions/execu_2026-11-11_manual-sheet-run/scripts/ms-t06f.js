const L=require('./lib');
module.exports=async()=>{const R={};const id=JSON.parse(require('fs').readFileSync(OUT+'/t06-id.json')).id;
 for(const m of ['PUT','PATCH']){const r=await api(m,'/desk/tickets/'+id+'/shares',{shares:[{department_id:L.D.CS,access:'read_only'}]});R['share '+m]=r.s+' '+r.t.slice(0,160);if(r.s<300){LED('T-06-09 share read_only to CS on '+id+' via '+m);break;}}
 R.get=(await api('GET','/desk/tickets/'+id+'/shares')).t.slice(0,250);
 // profile signature UI
 await pg.setViewportSize({width:1600,height:1000});await pg.getByRole('button',{name:'Open profile'}).click().catch(()=>{});
 await pg.goto(H+'/hq',{waitUntil:'commit'}).catch(()=>{});await pg.waitForTimeout(8000);await pg.getByRole('button',{name:'Open profile'}).click();await pg.waitForTimeout(1500);R.profileMenu=await pg.locator('[role=menuitem],[role=menu] a,[role=menu] button').allInnerTexts();await L.shot('t06-05-profile-menu');
 return R;};
